'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(
        models.Venue,
        {foreignKey: 'venueId'}
        // {foreignKey: 'venueId', onDelete: 'CASCADE', hooks: 'true'}
      );
      Event.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
        // {foreignKey: 'groupId', onDelete: 'CASCADE', hooks: 'true'}
      );
      Event.hasMany(
        models.EventImage,
        { foreignKey: 'eventId', onDelete: 'CASCADE'}
        // { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: 'true'}
      )
      // Event.hasMany(
      //   models.Venue,
      //   {foreignKey: 'venueId'}
      // );
      // Event.hasMany(
      //   models.Group,
      //   {foreignKey: 'groupId'}
      // );
      // Event.belongsTo(
      //   models.EventImage,
      //   { foreignKey: 'eventId'}
      // )
    }
  }
  Event.init({
    id: { //thanks alec, prevents confusion with multiple fk
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      notNull: true
    },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM,
      notNull: true,
      values: ['Online', 'In person']
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(8, 2),
    startDate: {
      type: DataTypes.DATE,
      notNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      notNull: true
    }
  }, {
    sequelize,
    modelName: 'Event',

    scopes: {
      eventNoDates() {
        return {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      }
    }
  });
  return Event;
};
