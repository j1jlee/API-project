'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(
        models.Attendance,
        { foreignKey: 'userId' }
      );
      User.belongsTo(
        models.Group,
        { foreignKey: 'organizerId' }
      );
      User.belongsTo(
        models.Membership,
        { foreignKey: 'userId' }
      );
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      notNull: true,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      notNull: true,
      //unique: true,
      validate: {
        //len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      notNull: true,
      //unique: true,
      validate: {
        //len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
      email: {
        type: DataTypes.STRING,
        notNull: true,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
          // isEmail(value) {
          //   if (!Validator.isEmail(value)) {
          //     throw new Error("Must be an email.")
          //   }
          // }
        }
    },
    hashedPassword: {
      type:DataTypes.STRING,
      notNull: true,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
        //Users, the hashedPassword, updatedAt, and, depending on your application, email and createdAt
      }
    }
  });
  return User;
};
