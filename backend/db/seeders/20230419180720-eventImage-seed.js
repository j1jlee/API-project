'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: '1',
        url: 'event1image-battle.png',
        preview: 'true',
      },
      {
        eventId: '2',
        url: 'event2image-park.png',
        preview: 'true',
      },
      {
        eventId: '3',
        url: 'event3image-meditation.png',
        preview: 'false',
      },
      {
        eventId: '4',
        url: 'event4image-glory-in-battle.png',
        preview: 'true',
      },
      {
        eventId: '5',
        url: 'event5image-chill.png',
        preview: 'true',
      },
      {
        eventId: '6',
        url: 'event6image-getit.png',
        preview: 'true',
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: ['1', '2', '3', '4', '5', '6'] }
    }, {});
  }
};
