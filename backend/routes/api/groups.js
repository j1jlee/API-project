// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, User, Venue } = require('../../db/models');
//
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')


const router = express.Router();

const validateGroup = [
    check('name')
        .exists({ checkFalsy: true})
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true})
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({ checkFalsy: true})
        .isIn(['Online', 'In person'])
        .withMessage('Type must be \'Online\' or \'In person\''),
    check('private')
        .exists({ checkFalsy: true})
        .isBoolean()
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    handleValidationErrors
];

router.get('/current', requireAuth, async (req, res) => {
    //console.log('req', req);
    const { user } = req;
    // console.log('user', user);
    // // console.log('userid?', user.datavalues.id);
    // console.log(user.id);
    // next();
    const userId = user.id;
    const currentUserGroups = await Group.findAll({
        where: {
            organizerId: userId
        }
    });

    res.json({"Groups": currentUserGroups});
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const groupsById = await Group.findByPk(groupId,
        {include: [
            {model: GroupImage.scope('giIncluded')},
            {model: User.scope('userIncluded'),
            as: "Organizer"
            //attributes, exclude?
                            },
            {model: Venue}]});
    if (!groupsById) {
        res.status(404);
        return res.json({"message": "Group couldn't be found"});
    }
        res.json(groupsById);
});

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
    res.json({"id": newGroupImage.groupId, "url": newGroupImage.url, "preview": newGroupImage.preview});
    // res.json(newGroupImage);
})

router.post('/', validateGroup, async (req, res) => {
    const { organizerId, name, about, type, private, city, state } = req.body;

    console.log('organizerId', organizerId);

    if (!organizerId) {
        organizerId = 1;
    }
    const newGroup = await Group.create({
        organizerId, name, about, type, private, city, state
    });
    res.status(201);
    res.json(newGroup);
})


router.get('/', async (req, res) => { //get all groups
    const resGroups = await Group.findAll({});

    res.json({"Groups": resGroups});
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
