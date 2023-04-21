'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      );
      Membership.belongsTo(
        models.Group,
        { foreignKey: 'groupId' }
      );
      // Membership.hasMany(
      //   models.User,
      //   { foreignKey: 'userId' }
      // );
      // Membership.hasMany(
      //   models.Group,
      //   { foreignKey: 'groupId' }
      // );
    }
  }
  Membership.init({
    id: { //thanks alec, prevents confusion with multiple fk
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      //foreignKey: true
    },
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'member', 'co-host'],
      notNull: true
    },
  }, {
    sequelize,
    modelName: 'Membership',
    scopes: {
      statusOnly() {
        return {
          attributes: {
            exclude: ['id', 'userId', 'groupId', 'createdAt', 'updatedAt']
          }
        }
      }
    }
  });
  return Membership;
};
