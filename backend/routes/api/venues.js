// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Venue } = require('../../db/models');
//
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')

const router = express.Router();


const validateVenue = [
    check('address')
        .exists({ checkFalsy: true})
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true})
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true})
        .isDecimal()
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];

//Edit a venue
router.put('/:venueId', validateVenue, async (req, res) => {
    const venueId = req.params.venueId;

    const currentVenue = await Venue.findByPk(venueId);

    if (!currentVenue) {
        res.status(404);
        res.json({"message": "Venue couldn't be found"});
    }

    const { address, city, state, lat, lng } = req.body;

        currentVenue.address = address;
        currentVenue.city = city;
        currentVenue.state = state;
        currentVenue.lat = lat;
        currentVenue.lng = lng;

        await currentVenue.save();
        res.status(200);

        const resObj = { id: currentVenue.id, groupId: currentVenue.groupId, address, city, state, lat, lng };
        res.json(resObj);


        // if (address) {
        //     currentVenue.address = address;
        // };
        // if (city) {
        //     currentVenue.city = city;
        // };
        // if (state) {
        //     currentVenue.state = state;
        // };
        // if (lat) {
        //     currentVenue.lat = lat;
        // };
        // if (lng) {
        //     currentVenue.lng = lng;
        // };
})

module.exports = router;
module.exports.validateVenue = validateVenue;
