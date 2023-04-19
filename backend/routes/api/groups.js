// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, User, Venue } = require('../../db/models');
//
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')


const router = express.Router();

//validateSignup middleware/// btw what does 'check' do
// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Please provide a valid email.'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true})
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   handleValidationErrors
// ];
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
            {model: GroupImage},
            {model: User,
            as: "Organizer",
            exclude: 'username'},
            {model: Venue}]});

    res.json(groupsById);
});


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
