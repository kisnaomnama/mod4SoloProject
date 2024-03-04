'use strict';
const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const spotImagesData = [
      {
        spotId: 1,
        url: 'https://example.com/image1.jpg',
        preview: true 
      },
      {
        spotId: 2,
        url: 'https://example.com/image2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://example.com/image3.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://example.com/image4.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://example.com/image5.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://example.com/image6.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://example.com/image7.jpg',
        preview: true
      }
    ];
      await SpotImage.bulkCreate(spotImagesData, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'spotImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};
