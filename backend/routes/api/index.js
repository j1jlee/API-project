//backend/routes/api/index.js

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const groupImagesRouter = require('./group-images.js');
const eventImagesRouter = require('./event-images.js');

const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

router.use('/group-images', groupImagesRouter);

router.use('/event-images', eventImagesRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

//
// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
    const user = await User.findAll({
    where: {
      username: 'Demo-lition'
    }
});
setTokenCookie(res, user);
return res.json({ user: user });
});


module.exports = router;



// router.get(
//     '/restore-user',
//     (req, res) => {
//         return res.json(req.user);
//     }
// );
// //
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//     '/require-auth',
//     requireAuth,
//     (req, res) => {
//         return res.json(req.user);
//     }
// );
