// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Event, Venue, Group, EventImage } = require('../../db/models');
//
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')

const router = express.Router();

// let startDateStr = new Date();
// let endDateStr = new Date();
// let dateNow = Date.now();

const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true})
        .custom(async (value) => {
            const venueCheck = await Venue.findByPk(value);

            if (!venueCheck) {
                throw new Error();
            }
        })
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true})
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        // .exists({ checkFalsy: true})
        .isIn(['Online', 'In person'])
        .withMessage('Type must be \'Online\' or \'In person\''),
    check('capacity')
        .exists({ checkFalsy: true})
        .isInt()
        .withMessage('Capacity must be an integer'),
    check('price')
        .exists({ checkFalsy: true})
        //.isDecimal()
        .isFloat({min: 0})
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true})
        .withMessage('Description is required'),
    check('startDate')
        .custom(async date => {
            const startDate = new Date(date);
            const startDateMilli = startDate.getTime();

            console.log('\n\n\nstartDateMilli', startDateMilli);
            const dateNow = Date.now();

            console.log('dateNowMilli', dateNow);

            if (dateNow > startDateMilli) {
                throw new Error();
            }

            //return startDateMilli > dateNow;
        })
        .withMessage(`Start date must be in the future`),
    check('endDate', 'startDate')
        .custom(async (eDate, rest) => {
            const endDate = new Date(eDate);
            const endDateMilli = endDate.getTime();
            //console.log('endDateMilli', endDateMilli);

            //console.log('sDate', req.req.body.startDate);
            const sDate = rest.req.body.startDate;
            const startDate = new Date(sDate);
            const startDateMilli = startDate.getTime();
            //console.log('startDateMilli', startDateMilli);

            //return endDateMilli > startDateMilli;
            if (startDateMilli > endDateMilli) {
                throw new Error();
            }
        })
        .withMessage(`End date is less than start date`),
    handleValidationErrors
]
// const validateVenue = [
//     check('address')
//         .exists({ checkFalsy: true})
//         .withMessage('Street address is required'),
//     check('city')
//         .exists({ checkFalsy: true})
//         .withMessage('City is required'),
//     check('state')
//         .exists({ checkFalsy: true})
//         .withMessage('State is required'),
//     check('lat')
//         .exists({ checkFalsy: true})
//         .isDecimal()
//         .withMessage('Latitude is not valid'),
//     check('lng')
//         .exists({ checkFalsy: true})
//         .isDecimal()
//         .withMessage('Longitude is not valid'),
//     handleValidationErrors
// ];

//Edit a venue
// router.put('/:venueId', async (req, res) => {
//     // validateVenue
//     const venueId = req.params.venueId;

//     const currentVenue = await Venue.findByPk(venueId);

//     if (!currentVenue) {
//         res.status(404);
//         res.json({"message": "Venue couldn't be found"});
//     }

//     const { address, city, state, lat, lng } = req.body;

//         currentVenue.address = address;
//         currentVenue.city = city;
//         currentVenue.state = state;
//         currentVenue.lat = lat;
//         currentVenue.lng = lng;

//         await currentVenue.save();
//         res.status(200);

//         const resObj = { id: currentVenue.id, groupId: currentVenue.groupId, address, city, state, lat, lng };
//         res.json(resObj);
// })

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

    res.json({"Events": resEvents});
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
