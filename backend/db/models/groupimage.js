'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupImage.belongsTo(
        models.Group,
        { foreignKey: 'groupId'}
      );
      // GroupImage.hasMany(
      //   models.Group,
      //   { foreignKey: 'groupId'}
      // );
    }
  }
  GroupImage.init({
    groupId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    preview: {
      type: DataTypes.BOOLEAN,
      notNull: true,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'GroupImage',
    // defaultScope: {
    //   attributes: {
    //     exclude: ['groupId', 'createdAt', 'updatedAt']
    //     //Users, the hashedPassword, updatedAt, and, depending on your application, email and createdAt
    //   }
    // }
    scopes: {
      giIncluded() {
        return {
          attributes: {
            exclude: ['groupId', 'createdAt', 'updatedAt']
          }
        }
      }
    }
  });
  return GroupImage;
};
