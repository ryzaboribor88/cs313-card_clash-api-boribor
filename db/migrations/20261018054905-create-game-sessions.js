'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      join_code: { type: Sequelize.STRING(6), allowNull: false, unique: true },
      question_set_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'question_sets', key: 'id' }, onDelete: 'RESTRICT' },
      mode: { type: Sequelize.STRING(10), allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'waiting' },
      started_at: { type: Sequelize.DATE, allowNull: true },
      ended_at: { type: Sequelize.DATE, allowNull: true },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};