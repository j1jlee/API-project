// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Event, Venue, Group, EventImage } = require('../../db/models');
const { addPreviewAndAttendees } = require('./groups.js');
//
const { validateEvent } = require('./customValidators');
//
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')


const router = express.Router();


//2. get detauls of event by id:

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
//post new groupimage to group
router.post('/:eventId/images', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;

    const eventCheck = await Event.findByPk(eventId);
    if (!eventCheck) {
        res.status(404);
        res.json({"message": "Event couldn't be found"});
    }

    const { url, preview } = req.body;

    const newEventImage = await EventImage.create({
        eventId, url, preview
    });

    res.status(200);
    const id = newEventImage.id;
    const resEIObj = { id, url, preview };
    res.json(resEIObj);

});


module.exports = router;
module.exports.validateEvent = validateEvent;
