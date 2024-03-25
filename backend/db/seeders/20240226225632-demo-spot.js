'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const spotsData = [
      {
        ownerId: 1,
        address: '1234 Oak Street',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        lat: 47.6062,
        lng: -122.3321,
        name: 'UFO Guadalupe',
        description: 'Relax and unwind in this unique UFO. Feel close to nature with maximum comfort.',
        price: 120.00
      },
      {
        ownerId: 2,
        address: '789 Elm Avenue',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        lat: 45.5051,
        lng: -122.6750,
        name: 'Spaceship Destination',
        description: 'Explore Spaceship amenities include a wet bar',
        price: 180.00

      },
      {
        ownerId: 3,
        address: '567 Maple Drive',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'The Mill',
        description: 'Built in the 19th century, view over the sea and surroundings on the top floor',
        price: 300.00
      },
      {
        ownerId: 1,
        address: '123 Oak Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 37.7749,
        lng: -20.4194,
        name: 'Dome Sweet Dome',
        description: 'Renovated & stylishly redecorated in 2019, this true-to-name Geodesic Dome ',
        price: 450.00
      }, 
       {
        ownerId: 2,
        address: '789 Pine Avenue',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 40.7749,
        lng: -120.4194,
        name: 'Manson Kone',
        description: 'Mordern apartment',
        price: 1000.00
      },
      {
        ownerId: 2,
        address: '100 Washington Street',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 30.6062,
        lng: -120.3321,
        name: 'Caboose in the redwoods',
        description: 'This rustic caboose is just 10 minutes from Cupertino and downtown Saratoga',
        price: 120.00
      },
      {
        ownerId: 4,
        address: '100 Washington Street',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 30.6062,
        lng: -120.3321,
        name: 'Bonita Domes and Pool',
        description: 'Earthen home in Joshua Tree',
        price: 120.00
      },

      {
        ownerId: 1,
        address: '2000 Oak Street',
        city: 'New York',
        state: 'WA',
        country: 'USA',
        lat: 40.6062,
        lng: -120.3321,
        name: 'Fat Barrel',
        description: 'The one & only, unique luxury lakeside Fat Barrel',
        price: 120.00
      },



    ];

    await Spot.bulkCreate(spotsData, { validate:true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, null, {});
  }
};
