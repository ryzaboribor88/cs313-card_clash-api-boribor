'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('participant_power_cards', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      participant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      power_card_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'power_cards', key: 'id' }, onDelete: 'CASCADE' },
      acquired_card_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'cards', key: 'id' }, onDelete: 'SET NULL' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'stored' },
      stored_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('participant_power_cards');
  },
};