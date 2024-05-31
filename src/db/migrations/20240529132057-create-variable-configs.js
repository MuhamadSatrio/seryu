'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('variable_configs', {
      key: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('variable_configs');
  }
};