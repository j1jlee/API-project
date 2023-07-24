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
        hashedPassword: bcrypt.hashSync('password'),
        imageUrl: 'https://aa-j1-project-bucket.s3.amazonaws.com/profile1.png'
      },
      {
        firstName: 'Brian',
        lastName: 'Twoman',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        imageUrl: 'https://aa-j1-project-bucket.s3.amazonaws.com/profile2.png'
      },
      {
        firstName: 'Sarah',
        lastName: 'Threemer',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        imageUrl: 'https://aa-j1-project-bucket.s3.amazonaws.com/profile3.png'
      },
      {
        firstName: 'Amanda',
        lastName: 'Fournery',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4'),
        imageUrl: 'https://aa-j1-project-bucket.s3.amazonaws.com/profile4.png'
      },
      {
        firstName: 'Sam',
        lastName: 'Fiveson',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password5'),
        imageUrl: 'https://aa-j1-project-bucket.s3.amazonaws.com/profile5.png'
      },
      {
        firstName: 'megaman',
        lastName: 'jones',
        email: 'megaman4@megaman.com',
        username: 'megaman',
        hashedPassword: bcrypt.hashSync('megaman'),
        imageUrl: 'https://aa-j1-project-bucket.s3.amazonaws.com/profile2.png'
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
      id: { [Op.gt]: 0 }
      // username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'megaman'] }
    }, {});
  }
};
