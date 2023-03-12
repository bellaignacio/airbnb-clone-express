'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 2,
        startDate: new Date(2022, 0, 1),
        endDate: new Date(2022, 0, 11)
      },
      {
        userId: 2,
        spotId: 3,
        startDate: new Date(2022, 1, 4),
        endDate: new Date(2022, 1, 18)
      },
      {
        userId: 3,
        spotId: 1,
        startDate: new Date(2022, 2, 9),
        endDate: new Date(2022, 2, 12)
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] },
    }, {});
  }
};
