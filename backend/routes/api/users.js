// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
//
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')

const { singlePublicFileUpload, singleMulterUpload } = require('../../utils/awsS3.js');

const router = express.Router();

//validateSignup middleware/// btw what does 'check' do
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true})
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// router.get('/', async (req, res) => {
//   const allUsers = await User.findAll();
//   res.json(allUsers);
// })

// Sign up
router.post(
    '/',
    singleMulterUpload("image"),
    validateSignup,
    async (req, res) => {

      // const { email, password, username } = req.body;

      console.log("\n\n\n\nat signup post")
      const reqBody = req.body;

      console.log("\n\n\n\nreqBody???", reqBody)

      console.log("\n\n\nreqFile???", req.file)

      const { email, password, username, firstName, lastName } = req.body;
      // const { email, password, username, firstName, lastName, image } = req.body;

      let image = '';
      if (req.file) {
        image = req.file;
      }
      let imageUrl = '';
      // console.log("\n\n\n\nwe here, req signup post", req.file)
      if (image) {
        // console.log("at req file", req.file)
        console.log("\n\n\n\nimage exists\n\n\n")
        imageUrl = await singlePublicFileUpload(image)
      } else {
        console.log("\n\n\nimage doesn't exist\n\n\n");
      }

      // if (req.file) {

      //   // console.log("at req file", req.file)

      //   imageUrl = await singlePublicFileUpload({ file: req.file })
      // }

      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword, firstName, lastName, imageUrl });

      const safeUser = {
        id: user.id,
        //
        firstName: user.firstName,
        lastName: user.lastName,
        //
        email: user.email,
        username: user.username,
        //
        imageUrl: user.imageUrl,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );



module.exports = router;
