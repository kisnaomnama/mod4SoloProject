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
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327078/samples/Spots/6080fb67-9592-4f6a-aa9d-0bb8a36e68e4_yp09tw.jpg',
      },
      {
        reviewId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327445/samples/Spots/330fb1bd-3d03-4df5-8f08-1e683c7e92a9_gioswf.jpg',
      },
      {
        reviewId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328266/samples/Spots/e6673a44-514a-4d8c-97df-dc4de23aab76_saa94l.jpg',
      },
      {
        reviewId: 2,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711327726/samples/Spots/8167c651-88dd-446c-93ca-4e08b7ba0b5d_rmx6es.jpg',
      },
      {
        reviewId: 3,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328532/samples/Spots/8f22ec8d-6d0b-460f-840b-1eb915a54c8d_fa8sq6.jpg',
      },
      {
        reviewId: 4,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711328095/samples/Spots/fdbf3164-fabe-4918-bf21-91c710239ad6_w8zcsl.jpg',
      },
      {
        reviewId: 5,
        url: 'https://res.cloudinary.com/dsnllj445/image/upload/v1711329022/samples/Spots/76bda565-6017-4b9f-a190-b53c61494dd3_tix8kr.jpg',
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
