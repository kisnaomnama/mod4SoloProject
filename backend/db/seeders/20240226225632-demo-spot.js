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
        name: 'Cozy Cabin',
        description: 'A charming cabin in the woods near the lake',
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
        name: 'Modern Loft',
        description: 'A modern loft apartment in the downtown area',
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
        name: 'Luxury Penthouse',
        description: 'A luxurious penthouse with stunning city views',
        price: 300.00
      }
    ];

    await Spot.bulkCreate(spotsData, { validate:true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, null, {});
  }
};
