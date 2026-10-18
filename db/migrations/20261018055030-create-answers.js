'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'game_sessions', key: 'id' }, onDelete: 'CASCADE' },
      card_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'cards', key: 'id' }, onDelete: 'CASCADE' },
      participant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      player_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'players', key: 'id' }, onDelete: 'CASCADE' },
      selected_choice: { type: Sequelize.INTEGER, allowNull: false },
      correct: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      points_earned: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      hp_change: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      answered_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addConstraint('answers', { type: 'unique', name: 'answers_card_unique', fields: ['card_id'] });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};