'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('decks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      participant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active' },
    });
    await queryInterface.addConstraint('decks', { type: 'unique', name: 'decks_participant_unique', fields: ['participant_id'] });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('decks');
  },
};