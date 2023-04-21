// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, User, Venue, Membership, Event, EventImage, Attendance } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')

const { validateVenue, validateEvent, validateGroup } = require('./customValidators.js');

const router = express.Router();

///




//
async function addPreviewAndAttendees (searchRes) {
    for (let event of searchRes) {
        //lazy load attendance, lazy load image
            const eventAttendees = await Attendance.findAll({
                where: {
                    eventId: event.id
                }
            })
            const eventAttendeesNum = eventAttendees.length;

            const previewImage = await EventImage.findOne({
                where: {
                    eventId: event.id,
                    preview: true
                }
            });

            //console.log('\n\n\n\nPREVIEWIMAGEEEEE', previewImage);
            if (previewImage) {
                event.dataValues.previewImage = previewImage.url;
            }
            if (eventAttendeesNum) {
                event.dataValues.numAttending = eventAttendeesNum;
            }
            await event.save();
        }
    //console.log(searchRes);
    return searchRes;
}

async function addPreviewAndMembers (searchRes) {
    for (let group of searchRes) {
        //lazy load attendance, lazy load image
            const groupMembers = await Membership.findAll({
                where: {
                    groupId: group.id
                }
            })

            let groupMembersNum = 0;
            if (groupMembers.length) {
                groupMembersNum = groupMembers.length;
            }

            const previewImage = await GroupImage.findOne({
                where: {
                    groupId: group.id,
                    preview: true
                }
            });

            //console.log('\n\n\n\nPREVIEWIMAGEEEEE', previewImage);
            if (previewImage) {
                group.dataValues.previewImage = previewImage.url;
            } else {
                group.dataValues.previewImage = "NA";
            }
            if (groupMembersNum >= 0) {
                group.dataValues.numMembers = groupMembersNum;
            }
            await group.save();
        }
    //console.log(searchRes);
    return searchRes;
}


///

//get current groups by user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const resGroups = [];

    //get groups where user is organizer
    const userId = user.id;
    const userOrganizedGroups = await Group.findAll({
        where: {
            organizerId: userId
        }
    });
    const userOrganizedGroupsRes = await addPreviewAndMembers(userOrganizedGroups);

    resGroups.push(...userOrganizedGroups);
    //get groups where user is member or co-host
    const memberCohost = await Membership.findAll({
        include: {
            model: Group
        },
        where: {
            userId,
            status: {
                [Op.in]: ['co-host', 'member']
            }
        }
    });
    for (let group of memberCohost) {
        let found = false;

        //console.log('\n\n\nGROUP', group.Group, 'typeof', typeof group.Group);

        for (let userGroup of userOrganizedGroups) {
            console.log('member group', group.dataValues.id, 'userGroup', userGroup.dataValues.id);

            if (group.dataValues.id == userGroup.dataValues.id) {
                console.log(`overlap found, skipping`)
                found = true;
            }
        if (found === false) {
            resGroups.push(group.Group);
        }
        }
        //console.log('\n\n\ngroup!', group.Group);
    }
    //console.log(memberCohost);


    // res.json({"Groups": userOrganizedGroupsRes});
    res.json({"Groups": resGroups});
});

//get venues by groupId
router.get('/:groupId/venues', async (req, res) => {
    const groupId = req.params.groupId;
    const groupVenues = await Venue.findAll({
        where: {
            groupId
        }
    });
    if (!groupVenues.length) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"});
    }
    res.json(groupVenues);
})

//create new venue by groupId
router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res) => {
    const groupId = req.params.groupId;
    const { user } = req;
    const userId = user.id;
    // const resCheck = cohostCheck(userId, groupId);
    // res.json(resCheck);
    const currentMembership = await Membership.findOne({
        include: {
            model: Group
        },
        where: {
            userId,
            groupId,
        }
    });
    if (!currentMembership) {
        res.status(400);
        return res.json({"message": "Must be co-host of group, or organizer to post new venue"});
    }

    if (currentMembership.status === "co-host" || currentMembership.Group.organizerId == userId) {
        const { address, city, state, lat, lng } = req.body;

        const newVenue = await Venue.create({
            groupId, address, city, state, lat, lng
        });

        res.status(200);
        const resObj = { id: newVenue.id, groupId, address, city, state, lat, lng }
        res.json(resObj);
    } else {
        res.status(400);
        res.json({"message": "Must be co-host of group, or organizer to post new venue"});
    }
})

//create, toJSON()


//get all group events by groupId
router.get('/:groupId/events', async (req, res) => {
    const groupId = req.params.groupId;


    const eventsByGroupId = await Event.scope('eventNoDates').findAll(
        {include: [
            {model: Group.scope('groupIncluded')},
            {model: Venue.scope('venueIncluded')},
            // {model: EventImage,
            // attributes: []}
            // // attributes: ['url']}
        ],
        where: {
            groupId
        }
     });
    if (!eventsByGroupId) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"});
    }
    // eventsByGroupId.previewImage = "testing";
    //need numattending, previewimage
    // const eventJSON = JSON.stringify(eventsByGroupId);
    // console.log('\n\n\n\n\nEVENT JSONNNNNNNNN', eventJSON[1]);


    const resEvents = await addPreviewAndAttendees(eventsByGroupId);
    console.log('resEvents', resEvents);
    // for (let event of eventsByGroupId) {
    //     //lazy load attendance, lazy load image
    //         const eventAttendees = await Attendance.findAll({
    //             where: {
    //                 eventId: event.id
    //             }
    //         })
    //         const eventAttendeesNum = eventAttendees.length;

    //         const previewImage = await EventImage.findOne({
    //             where: {
    //                 eventId: event.id,
    //                 preview: true
    //             }
    //         });

    //         //console.log('\n\n\n\nPREVIEWIMAGEEEEE', previewImage);
    //         if (previewImage) {
    //             event.dataValues.previewImage = previewImage.url;
    //         }
    //         if (eventAttendeesNum) {
    //             event.dataValues.numAttending = eventAttendeesNum;
    //         }
    //         await event.save();
    //     }

        // console.log('eventsByGroupId', eventsByGroupId);
        res.json(resEvents);
        // res.json(eventsByGroupId);
});



//get all groups by groupId
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    //console.log('\n\nhere', groupId);

    const groupsById = await Group.findByPk(groupId,
        {include: [
            {model: GroupImage.scope('giIncluded')},
            {model: User.scope('userIncluded'),
            as: "Organizer"},
            {model: Venue}]});
    if (!groupsById) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"});
    }
        res.json(groupsById);
});

//edit group by groupId
router.put('/:groupId', validateGroup, async (req, res) => {
    const groupId = req.params.groupId;

    const currentGroup = await Group.findByPk(groupId);

    if (!currentGroup) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

    const { name, about, type, private, city, state } = req.body;

    if (name) {
        currentGroup.name = name;
    };
    if (about) {
        currentGroup.about = about;
    };
    if (type) {
        currentGroup.type = type;
    };
    if (private) {
        currentGroup.private = private;
    };
    if (city) {
        currentGroup.city = city;
    };
    if (state) {
        currentGroup.state = state;
    };

    await currentGroup.save();
    res.status(200);
    res.json(currentGroup);
})

//create an event by groupid
router.post('/:groupId/events', requireAuth, validateEvent, async (req, res) => {
    const groupId = req.params.groupId;
    const { user } = req;
    const userId = user.id;
    // const resCheck = cohostCheck(userId, groupId);
    // res.json(resCheck);
    const currentMembership = await Membership.findOne({
        include: {
            model: Group
        },
        where: {
            userId,
            groupId,
        }
    });
    if (!currentMembership) {
        res.status(400);
        return res.json({"message": "Must be co-host of group, or organizer to post new venue"});
    }

    if (currentMembership.status === "co-host" || currentMembership.Group.organizerId == userId) {
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        const newEvent = await Event.create({
            groupId, venueId, name, type, capacity, price, description, startDate, endDate
        });

        res.status(200);
        const resObj = { id: newEvent.id, groupId, name, type, capacity, price, description, startDate, endDate }
        res.json(resObj);
    } else {
        res.status(400);
        res.json({"message": "Must be co-host of group, or organizer to post new venue"});
    }
})



//post new groupimage to group
router.post('/:groupId/images', requireAuth, async (req, res) => {
    const groupId = req.params.groupId;

    const groupCheck = await Group.findByPk(groupId);
    if (!groupCheck) {
        res.status(404);
        res.json({"message": "Group couldn't be found"});
    }

    const { url, preview } = req.body;

    const newGroupImage = await GroupImage.create({
        groupId, url, preview
    });

    res.status(200);
    // console.log('newGroupImage', newGroupImage)
    //newGroupImage.addScope('giIncluded');
    const id = newGroupImage.id;
    const resGIObj = { id, url, preview };
    res.json(resGIObj);
    // res.json({"id": newGroupImage.groupId, "url": newGroupImage.url, "preview": newGroupImage.preview});
    // res.json(newGroupImage);
});

router.post('/', validateGroup, async (req, res) => {
    const { organizerId, name, about, type, private, city, state } = req.body;

    console.log('organizerId', organizerId);

    if (!organizerId) {
        organizerId = 1;
    }
    const newGroup = await Group.create({
        organizerId, name, about, type, private, city, state
    });
    //const resObj = { name, about, type, private, city, state };
    res.status(201);
    res.json(newGroup); //how to exclude createdAt, updatedAt?
})

//get all groups
router.get('/', async (req, res) => { //get all groups
    const resGroups = await Group.findAll({});

    const resGroupsPreviewMembers = await addPreviewAndMembers(resGroups);


    res.json({"Groups": resGroupsPreviewMembers});
    // res.send(resGroups);
});
// // Sign up
// router.post(
//     '/',
//     validateSignup,
//     async (req, res) => {

//       // const { email, password, username } = req.body;
//       const { email, password, username, firstName, lastName } = req.body;
//       const hashedPassword = bcrypt.hashSync(password);
//       const user = await User.create({ email, username, hashedPassword, firstName, lastName });

//       const safeUser = {
//         id: user.id,
//         //
//         firstName: user.firstName,
//         lastName: user.lastName,
//         //
//         email: user.email,
//         username: user.username,
//       };

//       await setTokenCookie(res, safeUser);

//       return res.json({
//         user: safeUser
//       });
//     }
//   );



module.exports = router;
module.exports.addPreviewAndAttendees = addPreviewAndAttendees;
