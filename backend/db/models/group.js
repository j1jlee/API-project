'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(
        models.Event,
        { foreignKey: 'groupId'}
      );
      Group.hasMany(
        models.Venue,
        { foreignKey: 'groupId'}
      );
      Group.hasMany(
        models.Membership,
        { foreignKey: 'groupId'}
      );
      Group.hasMany(
        models.GroupImage,
        { foreignKey: 'groupId'}
      );
      Group.belongsTo(
        models.User,
        { foreignKey: 'organizerId',
        as: "Organizer" }
      );
      // Group.belongsTo(
      //   models.Event,
      //   { foreignKey: 'groupId'}
      // );
      // Group.belongsTo(
      //   models.Venue,
      //   { foreignKey: 'groupId'}
      // );
      // Group.belongsTo(
      //   models.Membership,
      //   { foreignKey: 'groupId'}
      // );
      // Group.belongsTo(
      //   models.GroupImage,
      //   { foreignKey: 'groupId'}
      // );
      // Group.hasMany(
      //   models.User,
      //   { foreignKey: 'organizerId' }
      // );
    }
  }
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      notNull: true
    },
    about: {
      type: DataTypes.TEXT,
      notNull: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In person'],
      notNull: true
    },
    private: {
      type: DataTypes.BOOLEAN,
      notNull: true
    },
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
