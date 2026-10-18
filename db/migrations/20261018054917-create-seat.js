'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seat', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      game: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'game_sessions', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' }, onDelete: 'CASCADE' },
      nickname: { type: Sequelize.STRING(30), allowNull: false },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seat_number: { type: Sequelize.INTEGER, allowNull: true },
      joined_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addConstraint('seat', { type: 'unique', name: 'seat_game_user_unique', fields: ['game', 'user_id'] });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seat');
  },
};