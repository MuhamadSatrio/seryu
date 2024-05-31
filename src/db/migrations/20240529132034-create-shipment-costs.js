'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipment_costs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      driver_code: {
        type: Sequelize.STRING,
        references: {
          model: 'drivers',
          key: 'driver_code'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      shipment_no: {
        type: Sequelize.STRING,
        references: {
          model: 'shipments',
          key: 'shipment_no'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total_costs: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      cost_status: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isIn: [['PENDING', 'CONFIRMED', 'PAID']]
        }
      }
    });

    await queryInterface.addConstraint('shipment_costs', {
      fields: ['driver_code', 'shipment_no'],
      type: 'unique',
      name: 'unique_shipment_costs'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('shipment_costs', 'unique_shipment_costs');
    await queryInterface.dropTable('shipment_costs');
  }
};
