'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('driver_attendances', {
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
      attendance_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      attendance_status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    });

    await queryInterface.addConstraint('driver_attendances', {
      fields: ['driver_code', 'attendance_date'],
      type: 'unique',
      name: 'unique_attendance'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('driver_attendances', 'unique_attendance');
    await queryInterface.dropTable('driver_attendances');
  }
};
