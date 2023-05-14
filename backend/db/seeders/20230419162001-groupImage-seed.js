'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      options.tableName = 'GroupImages';
      return queryInterface.bulkInsert(options, [
        // {
        //   groupId: '1',
        //   url: 'pokemonGroupImg.png',
        //   preview: 'true',
        // },
        // {
        //   groupId: '2',
        //   url: 'secretJediNoPreview.png',
        //   preview: 'false',
        // },
        // {
        //   groupId: '3',
        //   url: 'thickSolidProgress.png',
        //   preview: 'true',
        // }
        {
          groupId: '1',
          url: 'https://github.com/j1jlee/API-project/blob/main/images/pokemon/pokemon-03.png?raw=true',
          preview: 'true',
        },
        {
          groupId: '2',
          url: 'https://github.com/j1jlee/API-project/blob/main/images/jedi/jedi-01.png?raw=true',
          preview: 'true',
        },
        {
          groupId: '3',
          url: 'https://github.com/j1jlee/API-project/blob/main/images/muscle/muscle-01.png?raw=true',
          preview: 'true',
        }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
