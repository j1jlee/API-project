'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: '1',
        name: 'group1',
        about: 'This is the first group, for Pokemon trainers!',
        type: 'In person',
        private: 'false',
        city: "Pallet Town",
        state: "KO"
      },
      {
        organizerId: '2',
        name: 'group2',
        about: 'Second group, online meetup, invite only!',
        type: 'Online',
        private: 'true',
        city: "Dagobah",
        state: "SW"
      },
      {
        organizerId: '3',
        name: 'group3',
        about: 'Wanna get jacked? Absolutely shredded? Just yoked? Join today!',
        type: 'In person',
        private: 'false',
        city: "MuscleTown",
        state: "BF"
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['group1', 'group2', 'group3'] }
    }, {});
  }
};
