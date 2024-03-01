'use strict';

/** @type {import('sequelize-cli').Migration} */
const { ReviewImage } = require('../models'); // Adjust the import path based on your project structure

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const reviewImagesData = [
      {
        reviewId: 1,
        url: 'https://example.com/image1.jpg',
      },
      {
        reviewId: 2,
        url: 'https://example.com/image2.jpg',
      },
      {
        reviewId: 3,
        url: 'https://example.com/image3.jpg',
      },
      {
        reviewId: 2,
        url: 'https://example.com/image3.jpg',
      },
      {
        reviewId: 3,
        url: 'https://example.com/image3.jpg',
      },
      {
        reviewId: 4,
        url: 'https://example.com/image3.jpg',
      },
      {
        reviewId: 5,
        url: 'https://example.com/image3.jpg',
      }
    ];

    // Insert sample data using bulkCreate with validate: true
    await ReviewImage.bulkCreate(reviewImagesData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};
