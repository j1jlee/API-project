'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.hasMany(
        models.Event,
        {foreignKey: 'eventId'}
      );

      Attendance.hasMany(
        models.User,
        {foreignKey: 'userId'}
      );
    }
  }
  Attendance.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['attending', 'waitlist', 'pending'],
      notNull: true
    },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
