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
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710930147/samples/houses/pexels-pixabay-259588_vovazn.jpg',
        preview: true 
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710930083/samples/houses/istockphoto-576909072-1024x1024_gse5pz.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710930058/samples/houses/pexels-binyamin-mellish-1396122_dshka2.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710929858/samples/houses/istockphoto-1264323513-1024x1024_cvxpoe.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710929819/samples/houses/istockphoto-1208210864-1024x1024_ew9jp6.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710929945/samples/houses/istockphoto-1349313772-1024x1024_e3tpz5.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1710929843/samples/houses/istockphoto-1255835529-1024x1024_hmgzpz.jpg',
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
