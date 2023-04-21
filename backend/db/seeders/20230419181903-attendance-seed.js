'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: '1',
        userId: '1',
        status: 'attending'//attending, waitlist, pending
      },
      {
        eventId: '1',
        userId: '2',
        status: 'waitlist'//attending, waitlist, pending
      },
      {
        eventId: '2',
        userId: '1',
        status: 'pending'//attending, waitlist, pending
      },
      {
        eventId: '2',
        userId: '2',
        status: 'attending'//attending, waitlist, pending
      },
      {
        eventId: '3',
        userId: '3',
        status: 'pending'//attending, waitlist, pending
      },
      {
        eventId: '3',
        userId: '4',
        status: 'waitlist'//attending, waitlist, pending
      },
      {
        eventId: '4',
        userId: '3',
        status: 'attending'//attending, waitlist, pending
      },
      {
        eventId: '4',
        userId: '4',
        status: 'pending'//attending, waitlist, pending
      },
      {
        eventId: '5',
        userId: '5',
        status: 'waitlist'//attending, waitlist, pending
      },
      {
        eventId: '5',
        userId: '6',
        status: 'attending'//attending, waitlist, pending
      },
      {
        eventId: '6',
        userId: '5',
        status: 'attending'//attending, waitlist, pending
      },
      {
        eventId: '6',
        userId: '6',
        status: 'waitlist'//attending, waitlist, pending
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: ['1', '2', '3', '4', '5', '6'] }
    }, {});
  }
};
