'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Leo',
        lastName:'Decaprio',
        email: 'leo@gmail.com',
        username: 'leodecap',
        hashedPassword: bcrypt.hashSync('leopassword')
      },
      {
        firstName: 'Tom',
        lastName:'Cruise',
        email: 'tom@gmail.com',
        username: 'tommy',
        hashedPassword: bcrypt.hashSync('tompassword')
      },
      {
        firstName: 'Jennifer',
        lastName:'lopez',
        email: 'lopez@yahoo.com',
        username: 'jenlopez',
        hashedPassword: bcrypt.hashSync('lopezpassword')
      },
      {
        firstName: 'Demi',
        lastName:'Lition',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName:'User',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options, null, {});
  }
};
