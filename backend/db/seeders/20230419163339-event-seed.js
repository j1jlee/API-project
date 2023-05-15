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
        venueId: '1',
        groupId: '1',
        name: 'Trade Event!',
        description: 'Find your pokemon a new home! Evolve some of your friends!',
        type: 'In person',
        capacity: '130',
        price: '0.00',
        startDate: new Date(2023, 5, 16, 5, 33),
        endDate: new Date(2023, 5, 17)
      },
      //try past event
      {
        venueId: '2',
        groupId: '1',
        name: 'Trainer Food n Chat',
        description: 'Grab a bite to eat, share old gym stories, hang out! A meeting for the old-timers!',
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
///try past events
      {
        venueId: '3',
        groupId: '2',
        name: 'Lightsaber building',
        description: 'Build your own legendary blade. Kyber crystals available...for a price',
        type: 'In person',
        capacity: '25',
        price: '250.00',
        startDate: new Date(2022, 3, 21, 4, 15),
        endDate: new Date(2022, 3, 22)
      },
      {
        venueId: '4',
        groupId: '2',
        name: 'Capture the Flag',
        description: 'Yearly CTF challenge! First to 10 wins! Not in person, of course. Running is cardio, and cardio is for the Sith.',
        type: 'Online',
        capacity: '50',
        price: '0',
        startDate: new Date(2022, 5, 15, 8, 15),
        endDate: new Date(2022, 5, 15, 10, 30)
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

      ///past events
      {
        venueId: '5',
        groupId: '3',
        name: 'Back attack',
        description: 'Attack that back! Add some mass! Deadlifts, rows, and pulls galore!',
        type: 'In person',
        capacity: '20',
        price: '0',
        startDate: new Date(2023, 4, 22, 12, 5),
        endDate: new Date(2023, 4, 23)
      },
      {
        venueId: '6',
        groupId: '3',
        name: 'Call you back',
        description: `Don't call me back it's a trap can't lat me go don't be so oblique`,
        type: 'In person',
        capacity: '50',
        price: '25',
        startDate: new Date(2022, 8, 15, 7, 25),
        endDate: new Date(2022, 8, 15, 8, 30)
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
