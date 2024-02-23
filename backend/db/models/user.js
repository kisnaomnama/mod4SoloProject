'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    { // options object 
      defaultScope: {
        // Define default scope details here
        exclude: ['hashedPassword']
      },
      scopes: {
        [scopeName1]: {
          // define scope 1 details here
        },
        [scopeName2]: {
          // define scope 2 details here
        },
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );
  return User;
};
