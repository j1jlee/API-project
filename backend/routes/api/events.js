// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
//setTokenCookie,
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Event, Venue, Group, EventImage, Attendance, User, Membership } = require('../../db/models');
const { addPreviewAndAttendees } = require('./groups.js');
//
const { validateEvent, validateQuery } = require('./customValidators');
//validateEventAttendee, validateUserOrgCohost,
const { isOrganizer, isCohost, isAttendee } = require('./customAuthenticators');
//
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')


const router = express.Router();

//get all attendees of an event by id:
router.get('/:eventId/attendees', async (req, res) => {
    const { user } = req;
    const userId = user.id;

    const eventId = req.params.eventId;

    const currentEvent = await Event.findByPk(eventId);
    if (!currentEvent) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"});
    }
    const groupId = currentEvent.dataValues.groupId;


    // const userValidation = await validateUserOrgCohost(userId, groupId);

    // let resObj = [];

    // let query = {include: { model: User }};

    // if (typeof userValidation === 'object') {
    //     query.where = {
    //         eventId,
    //         status: {
    //             [Op.not]: "pending"
    //         }
    //     }
    // } else {
    //     query.where = { eventId }
    // }
///////////
    const isUserOrganizer = await isOrganizer(req, groupId);
    const isUserCohost = await isCohost(req, groupId);

    let resObj = [];
    let query = {include: { model: User }};

    if ((isUserOrganizer === true) || (isUserCohost === true)) {
        query.where = { groupId }
    } else {
        query.where = {
            eventId,
            status: {
                [Op.not]: "pending"
            }
        }
    }
    ///////
    const attendees = await Attendance.findAll(query);

    for (let attendee of attendees) {
        //console.log('\n\n\nMEMBERSHIP', membership)
        let addon = {
            id: attendee.dataValues.id,
            firstName: attendee.User.firstName,
            lastName: attendee.User.lastName,
            Attendance: { status: attendee.dataValues.status }
        };
        //console.log('DOES THIS WORK', addon);
        resObj.push(addon);
    }

    res.json({ Members: resObj });
});

////request attendance to an event

//request a membership based on groupid
router.post('/:eventId/Attendance', requireAuth, async (req, res) => {

    const { user } = req;
    const userId = user.id;
    const eventId = req.params.eventId;

    const currentEvent = await Event.findByPk(eventId);
    if (!currentEvent) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"});
    }

    const groupId = currentEvent.dataValues.groupId;

    const membership = await Membership.findOne({
        where: {
            userId,
            groupId
        }
    })

    if (!membership || membership.status === "pending") {
        res.status(404);
        return res.json({"message": "Must be a member to attend Event"});
    }

    //['attending', 'waitlist', 'pending'],

    //member ['pending', 'member', 'co-host']


    const currentAttendance = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    });

    //console.log('currentMember status', currentAttendance);
    if (!currentAttendance) {
        const newAttendee = await Attendance.create({
            userId, eventId, status: "pending"
        });

        const resAttendee = { userId, status: newAttendee.status };
        return res.json(resAttendee);
    }

    if (currentAttendance.status === 'pending') {
        res.status(400);
        return res.json({
            "message": "Attendance has already been requested"
          })
    }
    else if (["waitlist", "attending"].includes(currentAttendance.status)) {
        res.status(400);
        return res.json({
            "message": "User is already an attendee of the event"
          })
    };
    const newAttendee = await Attendance.create({
        userId, eventId, status: "pending"
    });

    const resAttendee = { userId, status: newAttendee.status };
    return res.json(resAttendee);
    // if (!currentAttendance) {
    //     res.status(404);
    //     return res.json({
    //         "message": "Event couldn't be found"
    //       });
    // }

});


/////////////////////////////////////

///change attendance status
router.put('/:eventId/Attendance', requireAuth, async (req, res) => {
    const error = {};

    const { user } = req;
    const userId = user.id;

    const eventId = req.params.eventId;

    const reqAttendeeId = req.body.userId;
    const reqStatus = req.body.status;

    const reqAttendee = await User.findByPk(reqAttendeeId);
    if (!reqAttendee) {
        res.status(400);
        error.message = "Validation Error";
        error.errors = { memberId: "User couldn't be found"}
        return res.json(error);
    }

    const reqEvent = await Event.findByPk(eventId);
    if (!reqEvent) {
        res.status(404);
        error.message = "Event couldn't be found";
        return res.json(error);
    }
    //
    const groupId = reqEvent.groupId;
    console.log('\n\n\ngroupId', groupId);

    const currentAttendance = await Attendance.findOne({
        include: {
            model: Event
        },
        where: {
            userId: reqAttendeeId,
            eventId
        }
    });
    if (!currentAttendance) {
        res.status(404);
        error.message = "Attendance between the user and the event does not exist";
        return res.json(error);
    };

    //const currentStatus = currentAttendance.status;
    //['attending', 'waitlist', 'pending'],
    if (reqStatus === "pending") {
        res.status(400);
        error.message = "Validation Error";
        error.errors = {status: "Cannot change a Attendance status to pending"}
        return res.json(error);
    }

    // const validationRes = await validateUserOrgCohost(userId, eventId);
    // if (typeof validationRes === 'object') {
    //         res.status(400);
    //         error.message = "Validation Error";
    //         error.errors = { user: "Current User must already be the organizer or have a membership to the group with the status of \"co-host\""}
    //         return res.json(error);
    // };
    const isUserOrganizer = await isOrganizer(req, groupId);
    const isUserCohost = await isCohost(req, groupId);

    if (isUserOrganizer === false && isUserCohost === false) {
        res.status(400);
        error.message = "Validation Error";
        error.errors = { user: "Current User must already be the organizer or have a membership to the group with the status of 'co-host'"}
        return res.json(error);
    };


    currentAttendance.status = reqStatus;
    await currentAttendance.save();
    //console.log("currentAttendance", currentAttendance);

    return res.json({id: currentAttendance.id, eventId, userId: reqAttendeeId, status: reqStatus})

});
///////////////////

//delete an attendance
router.delete('/:eventId/attendance', async (req, res) => {
    const { user } = req;
    const currentUserId = user.id;

    const eventId = req.params.eventId;
    const currentEvent = await Event.findByPk(eventId);
    if (!currentEvent) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"});
    }


    const reqUserId = req.body.userId;
    //
    const attendances = await Attendance.findOne({
        where: {
            eventId,
            userId: reqUserId
            }
    });
    if (!attendances) {
        res.status(404);
        return res.json({"message": "Attendance does not exist for this User"});
    }

    const venueEvent = await Event.findByPk(eventId, {
        include: {
            model: Group
        }
    });
    const organizerId = venueEvent.Group.organizerId;

    if (currentUserId === reqUserId || currentUserId === organizerId) {
        await attendances.destroy();
        res.json({"message": "Successfully deleted attendance from event"});
    } else {
        res.status(403);
        return res.json({"message": "Only the User or organizer may delete an Attendance"});
    }
    //
})


//2. get details of event by id:
router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    //console.log('\n\n\neventId', eventId);

    const resEvent = await Event.findByPk(eventId,
        {include: [
        {model: Group.scope('eventScope')},
        {model: Venue.scope('eventScope')},
        {model: EventImage.scope('eventScope')},
    ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    if (!resEvent) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const eventAttendees = await Attendance.findAll({
        where: {
            eventId
        }
    })
    const eventAttendeesNum = eventAttendees.length;
    if (eventAttendeesNum >= 0) {
        resEvent.dataValues.numAttending = eventAttendeesNum;
        await resEvent.save();
    }

    res.json(resEvent);
});

//delete an event by eventid
router.delete('/:eventId', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const { user } = req;
    const userId = user.id;
    //console.log('\n\n\neventId', eventId);

    const resEvent = await Event.findByPk(eventId);

    if (!resEvent) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"})
    }

    const groupId = resEvent.groupId;
    // console.log(groupId);

    // const userValidate = await validateUserOrgCohost(userId, groupId);
    // if (typeof userValidate === 'object') {
    //     res.status(404);
    //     return res.json({"message": 'Current User must be the organizer of the group or a member of the group with a status of "co-host"'});
    // };
    const isUserOrganizer = await isOrganizer(req, groupId);
    const isUserCohost = await isCohost(req, groupId);

    if (isUserOrganizer === false && isUserCohost === false) {
        res.status(400);
        error.message = "Validation Error";
        error.errors = { user: "Current User must already be the organizer or have a membership to the group with the status of 'co-host'"}
        return res.json(error);
    };

    await resEvent.destroy();
    res.json({
        "message": "Successfully deleted"
      });
})



//edit an event specified by its id
router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
    const eventId = req.params.eventId;
    const { user } = req;
    const userId = user.id;

    const currentEvent = await Event.findByPk(eventId);
    if (!currentEvent) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"});
    }
    const groupId = currentEvent.groupId;

    //validate that user is organizer, or cohost
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

    if ((isUserOrganizer === true) ||
        (isUserCohost === true)) {
        //
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

        const currentVenue = await Venue.findByPk(venueId);
        if (!currentVenue) {
            res.status(404);
            return res.json({"message": "Venue couldn't be found"});
        }

        currentEvent.venueId = venueId;
        currentEvent.name = name;
        currentEvent.type = type;
        currentEvent.capacity = capacity;
        currentEvent.price = price;
        currentEvent.description = description;
        currentEvent.startDate = startDate;
        currentEvent.endDate = endDate;

        await currentEvent.save();

        const resObj = { id: eventId, groupId, venueId, name, type, capacity, price, description, startDate, endDate };
        return res.json(resObj);
        //
    }
    res.status(400);
    return res.json({"message": "User must be group organizer, co-host member, or event attendee to edit an event"});


});


//1. get all events
router.get('/', validateQuery, async (req, res) => {
    //final, add query filter

    let { page, size, name, type, startDate } = req.query;
    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page) || (page <= 0) || (page >= 11)) {
      page = 1;
    }
    if (Number.isNaN(size) || (size <= 0) || (size >= 21)) {
      size = 20;
    }

    const params = {
        limit: size,
        offset: size * (page - 1)
    }

    if (startDate) {
        startDate = new Date(startDate);

        //console.log('\n\n\nstartDate', startDate);
    }

    const where = {};
    if (name) {
        where.name = name;
    };
    if (type) {
        where.type = type;
    };
    if (startDate) {
        where.startDate = startDate;
    };
    //query filter

    const resEvents = await Event.findAll(
        {
        ...params,
        include: [
        {model: Group.scope('groupIncluded')},
        // {model: User.scope('userIncluded'),
        // as: "Organizer"},
        {model: Venue.scope('venueIncluded')}],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        // ...params,
        where
    });

    const resEventsPreviewAttendees = await addPreviewAndAttendees(resEvents);

    res.json({"Events": resEventsPreviewAttendees});

});

//add image to event
router.post('/:eventId/images', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    // const { user } = req;
    // const userId = user.id;

    const eventCheck = await Event.findByPk(eventId);
    if (!eventCheck) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"});
    }

    const groupId = eventCheck.groupId;
    //console.log('groupId', groupId);

    // const validationRes = await validateEventAttendee(userId, eventId);
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
    const isUserAttendee = await isAttendee(req, eventId);

    if ((isUserOrganizer === true) ||
        (isUserCohost === true) ||
        (isUserAttendee === true)) {
        //
        const { url, preview } = req.body;

        const newEventImage = await EventImage.create({
            eventId, url, preview
        });

        res.status(200);
        const id = newEventImage.id;
        const resEIObj = { id, url, preview };
        return res.json(resEIObj);
    }
    res.status(400);
    return res.json({"message": "User must be group organizer, co-host member, or event attendee to add image to event"});
});


module.exports = router;
module.exports.validateEvent = validateEvent;
