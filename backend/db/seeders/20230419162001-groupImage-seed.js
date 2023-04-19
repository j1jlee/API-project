'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      options.tableName = 'groupImages';
      return queryInterface.bulkInsert(options, [
        {
          groupId: '1',
          url: 'pokemonGroupImg.png',
          preview: true,
        },
        {
          groupId: '2',
          url: 'secretJediNoPreview.png',
          preview: false,
        },
        {
          groupId: '3',
          url: 'thickSolidProgress.png',
          preview: true,
        }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'groupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
