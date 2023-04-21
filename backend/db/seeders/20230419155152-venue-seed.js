'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: '1',
        address: '111 Trainer Rd',
        city: 'Cerulean City',
        state: 'Kanto',
        lat: '32.112',
        lng: '12.131'
      },
      {
        groupId: '1',
        address: '222 2nd address',
        city: 'Cerulean City',
        state: 'Kanto',
        lat: '32.113',
        lng: '12.133'
      },
      {
        groupId: '2',
        address: '111.111.111.111',
        city: 'Internet...city',
        state: 'Denial',
        lat: '0.00',
        lng: '0.00'
      },
      {
        groupId: '2',
        address: 'the other dark web',
        city: 'Internet...city',
        state: 'Peace and tranquility',
        lat: '0.00',
        lng: '0.00'
      },
      {
        groupId: '3',
        address: '220 Vascular Lane',
        city: 'Muscle Beach',
        state: 'FL',
        lat: '6.220',
        lng: '10.00'
      },
      {
        groupId: '3',
        address: '600 Deadlift Rd',
        city: 'Swole City',
        state: 'NM',
        lat: '10.00',
        lng: '4.05'
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
