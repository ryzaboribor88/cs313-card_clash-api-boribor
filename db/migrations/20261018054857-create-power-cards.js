'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('power_cards', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(50), allowNull: false },
      type: { type: Sequelize.STRING(20), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      effect: { type: Sequelize.STRING(50), allowNull: false },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('power_cards');
  },
};