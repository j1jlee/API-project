'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

//const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'firstname1',
        lastName: 'lastname1',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'firstname2',
        lastName: 'lastname2',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'firstname3',
        lastName: 'lastname3',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'firstname4',
        lastName: 'lastname4',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'firstname5',
        lastName: 'lastname5',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'megaman',
        lastName: 'jones',
        email: 'megaman4@megaman.com',
        username: 'megaman',
        hashedPassword: bcrypt.hashSync('megaman')
      }
    ], {});
  },
    // const demoUser = await queryInterface.bulkInsert('User', [{
    //   username: 'demoUser',
    //   email: 'demo@email.com',
    //   hashedPassword:


  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
