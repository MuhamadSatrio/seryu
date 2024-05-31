'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipments', {
      shipment_no: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      shipment_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      shipment_status: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isIn: [['RUNNING', 'DONE', 'CANCELLED']]
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shipments');
  }
};
