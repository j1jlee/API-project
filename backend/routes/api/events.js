// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Event, Venue, Group, EventImage, Attendance } = require('../../db/models');
const { addPreviewAndAttendees } = require('./groups.js');
//
const { validateEvent, validateEventAttendee } = require('./customValidators');
//
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')


const router = express.Router();


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

    res.json({resEvent});
});

//edit an event specified by its id
router.put('/:eventId', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const { user } = req;
    const userId = user.id;

});


//1. get all events
router.get('/', async (req, res) => {
    const resEvents = await Event.findAll(
        {include: [
        {model: Group.scope('groupIncluded')},
        // {model: User.scope('userIncluded'),
        // as: "Organizer"},
        {model: Venue.scope('venueIncluded')}],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });

    const resEventsPreviewAttendees = await addPreviewAndAttendees(resEvents);

    res.json({"Events": resEventsPreviewAttendees});
});

//add image to event
router.post('/:eventId/images', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;

    const { user } = req;
    const userId = user.id;

    const eventCheck = await Event.findByPk(eventId);
    if (!eventCheck) {
        res.status(404);
        return res.json({"message": "Event couldn't be found"});
    }

    const validationRes = await validateEventAttendee(userId, eventId);
    if (typeof validationRes === 'object') {
        res.status(404);
        return res.json(validationRes);
    };


    const { url, preview } = req.body;

    const newEventImage = await EventImage.create({
        eventId, url, preview
    });

    res.status(200);
    const id = newEventImage.id;
    const resEIObj = { id, url, preview };
    return res.json(resEIObj);

});


module.exports = router;
module.exports.validateEvent = validateEvent;
