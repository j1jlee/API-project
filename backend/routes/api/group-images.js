// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Group, GroupImage, Membership } = require('../../db/models');
const { addPreviewAndAttendees } = require('./groups.js');
//
const { validateEvent, validateEventAttendee, validateUserOrgCohost } = require('./customValidators');
const membership = require('../../db/models/membership');

const router = express.Router();

router.get('/', async (req, res) => {
    const allGroupImages = await GroupImage.findAll();

    res.json(allGroupImages);
})

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    const userId = user.id;

    const imageId = req.params.imageId;
    const reqImage = await GroupImage.findByPk(imageId, {
        include: {
            model: Group
        }
    });
    if (!reqImage) {
        res.status(404);
        return res.json({"message": "Group Image couldn't be found"});
    }

    const groupId = reqImage.Group.id;
    const reqMembership = await Membership.findAll({
        where: {
            groupId,
            userId,
            status: "co-host"
        }
    })

    const organizerId = reqImage.Group.organizerId;

    if (reqMembership || organizerId === userId) {
        await reqImage.destroy();
        return res.json({
            "message": "Successfully deleted"
          })
    } else {
        res.status(404);
        return res.json({"message": 'Current user must be the organizer or "co-host" of the Group'});
    }



    //res.json(groupId);

})

module.exports = router;
