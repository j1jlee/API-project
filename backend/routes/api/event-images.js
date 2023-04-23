// backend/routes/api/users.js
const express = require('express')
//const bcrypt = require('bcryptjs');
//const { Op } = require('sequelize');

const { requireAuth } = require('../../utils/auth');
//setTokenCookie
//const { Group, GroupImage, User, Venue, Membership } = require('../../db/models');
const { Event, EventImage, Membership, Group } = require('../../db/models');
const { isCohost, isOrganizer } = require('./customAuthenticators');
//const { addPreviewAndAttendees } = require('./groups.js');
//
//const { validateEvent, validateEventAttendee, validateUserOrgCohost } = require('./customValidators');

const router = express.Router();

router.get('/', async (req, res) => {
    const allEventImages = await EventImage.findAll();

    res.json(allEventImages);
})

router.delete('/:imageId', requireAuth, async (req, res) => {
    const { user } = req;
    const userId = user.id;

    const imageId = req.params.imageId;
    const reqImage = await EventImage.findByPk(imageId, {
        include: {
            model: Event
        }
    });
    if (!reqImage) {
        res.status(404);
        return res.json({"message": "Event Image couldn't be found"});
    }

    const groupId = reqImage.Event.groupId;
    const reqMembership = await Membership.findAll({
        where: {
            groupId,
            userId,
            status: "co-host"
        }
    })

    // const organizerId = reqImage.Group.organizerId
    const reqGroup = await Group.findByPk(groupId);
    const organizerId = reqGroup.dataValues.organizerId;

    const isUserCohost = await isCohost(req, groupId);
    const isUserOrganizer = await isOrganizer(req, groupId);

    if (reqMembership || organizerId === userId ||
        isUserCohost === true || isUserOrganizer === true) {
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
