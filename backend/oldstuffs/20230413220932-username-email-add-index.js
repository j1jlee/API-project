'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
  options.tableName = 'Users';
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addIndex(options, ['username'], { unique: true});
    await queryInterface.addIndex(options, ['email'], { unique: true});
    // await queryInterface.addIndex('Users', ['username'], { unique: true});
    // await queryInterface.addIndex('Users', ['email'], { unique: true}, options);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex(options, ['username']);
    await queryInterface.removeIndex(options, ['email']);
    // await queryInterface.removeIndex('Users', ['username']);
    // await queryInterface.removeIndex('Users', ['email']);
  }
};
