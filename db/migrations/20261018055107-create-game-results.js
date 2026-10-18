'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_results', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'game_sessions', key: 'id' }, onDelete: 'CASCADE' },
      participant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      final_score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      final_hp: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      correct_answers: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      wrong_answers: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      power_cards_used: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      revivals_used: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      comeback_points: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      final_status: { type: Sequelize.STRING(20), allowNull: false },
    });
    await queryInterface.addConstraint('game_results', { type: 'unique', name: 'game_results_session_participant_unique', fields: ['session_id', 'participant_id'] });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_results');
  },
};