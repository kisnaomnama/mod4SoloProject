'use strict';

const { Review } = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const reviewsData = [
      {
        spotId: 1,
        userId: 1,
        review: 'This spot was amazing!',
        stars: 5
        
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Great experience overall!',
        stars: 4
 
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Could be better.',
        stars: 3
      }
    ];

    await Review.bulkCreate( reviewsData, {validate:true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, null, {});
  }
};
