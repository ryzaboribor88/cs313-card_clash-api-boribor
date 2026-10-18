'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comeback_cards', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      challenge_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'comeback_challenges', key: 'id' }, onDelete: 'CASCADE' },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'questions', key: 'id' }, onDelete: 'CASCADE' },
      fixed_points: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 100 },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comeback_cards');
  },
};