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
        userId: 1,
        startDate: subDays(currentDate, 1), // Subtract 1 day from the current date
        endDate: addDays(currentDate, 4), // Add 4 days to the current date
      },
      {
        spotId: 2,
        userId: 2,
        startDate: addDays(currentDate, 2), 
        endDate: addDays(currentDate, 6), 
      },
      {
        spotId: 3,
        userId: 3,
        startDate: addDays(currentDate, 5), 
        endDate: addDays(currentDate, 10), 
      }
    ];

    await Booking.bulkCreate( bookingsData, {validate: true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.dropTable(options);
  }
};
