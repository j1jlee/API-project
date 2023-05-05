// backend/routes/api/users.js
const express = require('express')
//const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
//setTokenCookie
const { Group, GroupImage, User, Venue, Membership, Event, EventImage, Attendance } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')

const { validateVenue, validateEvent, validateGroup } = require('./customValidators.js');
//validateUserOrgCohost, validateOrganizer
const { isOrganizer, isCohost } = require('./customAuthenticators');
//isAttendee

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
router.get('/:groupId/venues', requireAuth, async (req, res) => {
    const groupId = req.params.groupId;
    const { user } = req;
    const userId = user.id;

    const currentGroup = await Group.findByPk(groupId);
    if (!currentGroup) {
        res.status(400);
        return res.json({"message": "Group couldn't be found"});
    };
    const organizerId = currentGroup.organizerId;

    const currentMembership = await Membership.findOne({
        include: {
            model: Group
        },
        where: {
            userId,
            groupId,
        }
    });

    let valid = false;

    if (userId === organizerId) {
        valid = true;
    }
    //console.log('currentMembership', currentMembership, 'crr.status', currentMembership.status);

    if (currentMembership) {
        if (currentMembership.status === "co-host") {
            valid = true;
        }
    }

    if (valid) {
        const groupVenues = await Venue.findAll({
            where: {
                groupId
            }
        });
        return res.json({"Venues": groupVenues});
    } else {
        res.status(400);
        res.json({"message": "Must be co-host of group, or organizer to see venues"});
    }
});

//get members of a group by id
router.get('/:groupId/members', async (req, res) => {
    const { user } = req;
    const userId = user.id;
    const groupId = req.params.groupId;

    const currentGroup = await Group.findByPk(groupId);
    if (!currentGroup) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"});
    }

    // const userValidation = await validateUserOrgCohost(userId, groupId);

    const isUserOrganizer = await isOrganizer(req, groupId);
    const isUserCohost = await isCohost(req, groupId);

    let resObj = [];
    let query = {include: { model: User }};

    if ((isUserOrganizer === true) || (isUserCohost === true)) {
        query.where = { groupId }
    } else {
        query.where = {
            groupId,
            status: {
                [Op.not]: "pending"
            }
        }
    }

    // if (typeof userValidation === 'object') {
    //     query.where = {
    //         groupId,
    //         status: {
    //             [Op.not]: "pending"
    //         }
    //     }
    // } else {
    //     query.where = { groupId }
    // }

    const memberships = await Membership.findAll(query);

    for (let membership of memberships) {
        //console.log('\n\n\nMEMBERSHIP', membership)
        let addon = {
            id: membership.dataValues.id,
            firstName: membership.User.firstName,
            lastName: membership.User.lastName,
            Membership: { status: membership.dataValues.status }
        };
        //console.log('DOES THIS WORK', addon);
        resObj.push(addon);
    }

    res.json({ Members: resObj });
});


//create new venue by groupId
router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res) => {
    const groupId = req.params.groupId;
    const { user } = req;
    const userId = user.id;

    const currentGroup = await Group.findByPk(groupId);
    if (!currentGroup) {
        res.status(400);
        return res.json({"message": "Group couldn't be found"});
    }

    const organizerId = currentGroup.organizerId;

    const currentMembership = await Membership.findOne({
        include: {
            model: Group
        },
        where: {
            userId,
            groupId,
        }
    });
    // if (!currentMembership) {
    //     res.status(400);
    //     return res.json({"message": "Must be co-host of group, or organizer to post new venue"});
    // }
    //console.log('\n\n\nCurrentMembership', currentMembership, 'organizerId', organizerId);
    //currentMembership.status === "co-host" ||
    let valid = false;

    if (currentMembership) {
        if (currentMembership.status === "co-host") {
            //console.log('\n\n\nCurrent user is a co-host\n\n\n');
            valid = true;
        }
    }
    if (organizerId == userId) {
        valid = true;
    }

    if (valid) {
        const { address, city, state, lat, lng } = req.body;

        const newVenue = await Venue.create({
            groupId, address, city, state, lat, lng
        });

        res.status(200);
        const resObj = { id: newVenue.id, groupId, address, city, state, lat, lng }
        return res.json(resObj);
    } else {
        res.status(400);
        return res.json({"message": "Must be co-host of group, or organizer to post new venue"});
    }
})

//request a membership based on groupid
router.post('/:groupId/membership', requireAuth, async (req, res) => {

    const { user } = req;
    const userId = user.id;
    const groupId = req.params.groupId;

    const currentGroup = Group.findByPk(groupId);

    if (!currentGroup) {
        res.status(404);
        return res.json({
            "message": "Group couldn't be found"
          })
    }
    //['pending', 'member', 'co-host'],

    const currentMembership = await Membership.findOne({
        where: {
            userId,
            groupId
        }
    });

    //console.log('currentMember status', currentMembership);
    if (!currentMembership) {
        const newMember = await Membership.create({
            userId, groupId, status: "pending"
        });

        const resMember = { memberId: newMember.id, status: newMember.status };
        return res.json(resMember);
    }

    if (currentMembership.status === 'pending') {
        res.status(400);
        return res.json({
            "message": "Membership has already been requested"
          })
    }
    else if (["member", "co-host"].includes(currentMembership.status)) {
        res.status(400);
        return res.json({
            "message": "User is already a member of the group"
          })
    };
    const newMember = await Membership.create({
        userId, groupId, status: "pending"
    });

    const resMember = { memberId: newMember.id, status: newMember.status };
    return res.json(resMember);
    // if (!currentMembership) {
    //     res.status(404);
    //     return res.json({
    //         "message": "Group couldn't be found"
    //       });
    // }

});

router.get('/:groupId/membership/pending', async (req, res) => {
    const groupId = req.params.groupId;

    const pendingMemberships = await Membership.findAll({
        where: {
            groupId,
            status: "pending"
        }
    });

    res.json(pendingMemberships);
});


//change membership status
router.put('/:groupId/membership', requireAuth, async (req, res) => {
    const error = {};

    const { user } = req;
    const userId = user.id;

    const groupId = req.params.groupId;

    const reqMemberId = req.body.memberId;
    const reqStatus = req.body.status;

    const reqMember = await User.findByPk(reqMemberId);
    if (!reqMember) {
        res.status(400);
        error.message = "Validation Error";
        error.errors = { memberId: "User couldn't be found"}
        return res.json(error);
    }

    const reqGroup = await Group.findByPk(groupId);
    if (!reqGroup) {
        res.status(404);
        error.message = "Group couldn't be found";
        return res.json(error);
    }

    const currentMembership = await Membership.findOne({
        include: {
            model: Group
        },
        where: {
            userId: reqMemberId,
            groupId
        }
    });
    if (!currentMembership) {
        res.status(404);
        error.message = "Membership between the user and the group does not exist";
        return res.json(error);
    };

    const currentStatus = currentMembership.status;
    //reqStatus
    if (reqStatus === "pending") {
        res.status(400);
        error.message = "Validation Error";
        error.errors = {status: "Cannot change a membership status to pending"}
        return res.json(error);
    };

    if (currentStatus === "pending" && reqStatus === "member") {
        const isUserOrganizer = await isOrganizer(req, groupId);
        const isUserCohost = await isCohost(req, groupId);

        if (isUserOrganizer === false && isUserCohost === false) {
            res.status(400);
            error.message = "Validation Error";
            error.errors = { user: "Current User must already be the organizer or have a membership to the group with the status of 'co-host'"}
            return res.json(error);
        }
        // const validationRes = await validateUserOrgCohost(userId, groupId);
        // if (typeof validationRes === 'object') {
        //     res.status(400);
        //     error.message = "Validation Error";
        //     error.errors = { user: "Current User must already be the organizer or have a membership to the group with the status of \"co-host\""}
        //     return res.json(error);
        };
    //}
    //or currentStatus === pending as well? pending users can now just change status)
    if (currentStatus === "member" && reqStatus === "co-host") {
        if (currentMembership.Group.organizerId !== userId) {
            res.status(400);
            error.message = "Validation Error";
            error.errors = { user: "Current User must already be the organizer"};
            return res.json(error);
        }
    }

    //

    currentMembership.status = reqStatus;
    await currentMembership.save();
    //console.log("currentMembership", currentMembership);

    return res.json({id: currentMembership.id, groupId, memberId: reqMemberId, status: reqStatus})

});



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
    //console.log('resEvents', resEvents);

        res.json(resEvents);
        // res.json(eventsByGroupId);
});
//delete a membership
router.delete('/:groupId/membership', requireAuth, async (req, res) => {
    const groupId = req.params.groupId;
    const { user } = req;
    const userId = user.id;
    const error = {};
    // res.json("test");

    const reqMemberId = req.body.memberId;
    const reqMember = await User.findByPk(reqMemberId);

    if (!reqMember) {
        res.status(400);
        error.message = "Validation Error";
        error.errors = { memberId: "User couldn't be found"}
        return res.json(error);
    }

    const reqGroup = await Group.findByPk(groupId);
    if (!reqGroup) {
        res.status(404);
        error.message = "Group couldn't be found";
        return res.json(error);
    }
    const organizerId = reqGroup.organizerId;

    const currentMembership = await Membership.findOne({
        where: {
            userId: reqMemberId,
            groupId
        }
    });

    if (!currentMembership) {
        res.status(404);
        error.message = "Membership does not exist for this User";
        return res.json(error);
    }

    if (userId === organizerId || userId === reqMemberId) {
        await currentMembership.destroy();
        res.json({
        "message": "Successfully deleted membership from group"
        });
    } else {
        res.status(404);
        error.message = "Current User must be the host of the group, or the user whose membership is being deleted";
        return res.json(error);
    };
});



///delete a group
router.delete('/:groupId', requireAuth, async (req, res) => {
    const groupId = req.params.groupId;
    const { user } = req;
    const userId = user.id;
    //console.log('\n\n\ngroupId', groupId);

    const resGroup = await Group.findByPk(groupId);

    if (!resGroup) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"})
    }

    const organizerId = resGroup.organizerId;

    if (userId === organizerId) {
        await resGroup.destroy();
        res.json({
        "message": "Successfully deleted"
        });
    } else {
        res.status(404);
        return res.json({"message": 'Current User must be the organizer of the group'});
    };
});




///



//get details of group by groupId
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
    //
    const groupMembers = await Membership.findAll({
        where: {
            groupId
        }
    })

    let groupMembersNum = 0;
    if (groupMembers.length) {
        groupMembersNum = groupMembers.length;
    }
    //
    groupsById.dataValues.numMembers = groupMembersNum;


    res.json(groupsById);
});

//edit group by groupId
router.put('/:groupId', validateGroup, async (req, res) => {
    const groupId = req.params.groupId;

    const currentGroup = await Group.findByPk(groupId);

    if (!currentGroup) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"});
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
    return res.json(currentGroup);
})

//create an event by groupid
router.post('/:groupId/events', requireAuth, validateEvent, async (req, res) => {
    const groupId = req.params.groupId;
    // const { user } = req;
    // const userId = user.id;

    // const validationRes = await validateUserOrgCohost(userId, groupId);
    // if (typeof validationRes === 'object') {
    //     res.status(404);
    //     return res.json(validationRes);
    // };

    const isUserOrganizer = await isOrganizer(req, groupId);
    if (typeof isUserOrganizer === 'object') {
        res.status(404);
        return res.json(isUserOrganizer);
    }

    const isUserCohost = await isCohost(req, groupId);

    if ((isUserOrganizer === true) || (isUserCohost === true)) {
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        const newEvent = await Event.create({
            groupId, venueId, name, type, capacity, price, description, startDate, endDate
        });

        res.status(200);
        const resObj = { id: newEvent.id, groupId, venueId, name, type, capacity, price, description, startDate, endDate }
        return res.json(resObj);
    }
    res.status(400);
    return res.json({"message": "User must be organizer or co-host to create event"});

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
    const { name, about, type, private, city, state } = req.body;

    // console.log(req.user);

    const organizerId = req.user.id;

    //organizerId not pulled from req.body, it's pulled from user info (req.user)
    //console.log('organizerId', organizerId);


    const newGroup = await Group.create({
        organizerId, name, about, type, private, city, state
    });
    //const newGroupObj = { id:newGroup.id, organizerId, name, about, type, private, city, state}

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
