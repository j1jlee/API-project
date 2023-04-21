'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: '1',
        groupId: '1',
        name: 'Battle at 111 Trainer Rd!',
        description: 'Are your Pokemon up to the task? Find out Saturday at the Cerulean City Gym, in a one-trainer-takes-all competition!',
        type: 'In person',
        capacity: '200',
        price: '25',
        startDate: new Date(2024, 3, 22),
        endDate: new Date(2024, 3, 22)
      },
      {
        venueId: '2',
        groupId: '1',
        name: 'Pokemon trainer meetup',
        description: 'Local meetup for new Poke-moms and dads to meet up, give their Pokemon a chance to socialize!',
        type: 'In person',
        capacity: '40',
        price: '0',
        startDate: new Date(2024, 3, 21),
        endDate: new Date(2024, 3, 21)
      },
      {
        venueId: '3',
        groupId: '2',
        name: 'Jedi Training',
        description: 'While they are partying, let us study the blade-- GUILD MEMBERS ONLY',
        type: 'Online',
        capacity: '45',
        price: '0',
        startDate: new Date(2024, 3, 21),
        endDate: new Date(2024, 3, 21)
      },
      {
        venueId: '4',
        groupId: '2',
        name: 'FFA Kumite',
        description: 'Prove yourself... through ULTIMATE COMBAT',
        type: 'Online',
        capacity: '100',
        price: '200',
        startDate: new Date(2024, 3, 21),
        endDate: new Date(2024, 3, 21)
      },
      {
        venueId: '5',
        groupId: '3',
        name: 'Pump and Chill',
        description: 'Hang out, have a beer, pump some iron',
        type: 'In person',
        capacity: '60',
        price: '10',
        startDate: new Date(2024, 3, 21),
        endDate: new Date(2024, 3, 21)
      },
      {
        venueId: '6',
        groupId: '3',
        name: 'Max Out till you Pass Out',
        description: 'Event is next month! Think you\'re strong enough? Test out your max today!',
        type: 'In person',
        capacity: '100',
        price: '10',
        startDate: new Date(2024, 3, 21),
        endDate: new Date(2024, 3, 21)
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
