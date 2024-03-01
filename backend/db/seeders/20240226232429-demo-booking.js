'use strict';

const { addDays, subDays } = require('date-fns');
const { Booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();
    const bookingsData = [
      {
        spotId: 1,
        userId: 3,
        startDate: addDays(currentDate, 4), 
        endDate: addDays(currentDate, 8), // Add 4 days to the current date
      },
      {
        spotId: 2,
        userId: 1,
        startDate: addDays(currentDate, 5), 
        endDate: addDays(currentDate, 7), 
      },
      {
        spotId: 3,
        userId: 4,
        startDate: addDays(currentDate, 7), 
        endDate: addDays(currentDate, 10), 
      },

      {
        spotId: 4,
        userId: 1,
        startDate: addDays(currentDate, 8), 
        endDate: addDays(currentDate, 11), 
      },

      {
        spotId: 1,
        userId: 5,
        startDate: addDays(currentDate, 6), 
        endDate: addDays(currentDate, 8), 
      },
    ];

    await Booking.bulkCreate( bookingsData, {validate: true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.dropTable(options);
  }
};
