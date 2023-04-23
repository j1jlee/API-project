// backend/routes/api/users.js
const express = require('express')
//const bcrypt = require('bcryptjs');
//const { Op } = require('sequelize');

//const { setTokenCookie, requireAuth } = require('../../utils/auth');
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Venue } = require('../../db/models');
const { validateVenue } = require('./customValidators.js');
//, validateUserOrgCohost
const { isOrganizer, isCohost } = require('./customAuthenticators');
//, reqResTest
//
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation.js')

const router = express.Router();


//Edit a venue
router.put('/:venueId', validateVenue, async (req, res) => {

    //return await reqResTest(req, res, 'what');

    const venueId = req.params.venueId;
    const currentVenue = await Venue.findByPk(venueId);

    if (!currentVenue) {
        res.status(404);
        res.json({"message": "Venue couldn't be found"});
    }

    //console.log('currentVenue groupId', currentVenue.groupId);
    const groupId = currentVenue.groupId;
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

    if ((isUserOrganizer === true) ||
    (isUserCohost === true)) {
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
    }
    res.status(400);
    return res.json({"message": "User must be organizer or co-host"});

})

module.exports = router;
module.exports.validateVenue = validateVenue;
