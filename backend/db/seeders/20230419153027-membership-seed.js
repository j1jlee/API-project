'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: '1',
        groupId: '1',
        status: 'co-host',
      },
      {
        userId: '2',
        groupId: '2',
        status: 'co-host', //pending, member, cohost
      },
      {
        userId: '3',
        groupId: '3',
        status: 'co-host',
      },
      {
        userId: '4',
        groupId: '1',
        status: 'co-host',
      },
      {
        userId: '5',
        groupId: '2',
        status: 'member',
      },
      {
        userId: '6',
        groupId: '3',
        status: 'member',
      },
    ], {});

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['co-host', 'pending', 'member'] }
    }, {});
  }
};
