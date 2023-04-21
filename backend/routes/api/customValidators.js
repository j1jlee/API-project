const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation.js')


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
];

const validateGroup = [
    check('name')
        // .exists({ checkFalsy: true})
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        // .exists({ checkFalsy: true})
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        // .exists({ checkFalsy: true})
        .isIn(['Online', 'In person'])
        .withMessage('Type must be \'Online\' or \'In person\''),
    check('private')
        // .exists({ checkFalsy: true})
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

module.exports = { validateEvent, validateGroup, validateVenue };
