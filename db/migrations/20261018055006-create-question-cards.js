'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_cards', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'questions', key: 'id' }, onDelete: 'CASCADE' },
      difficulty: { type: Sequelize.STRING(10), allowNull: false },
      team_points: { type: Sequelize.INTEGER, allowNull: false },
      solo_points: { type: Sequelize.INTEGER, allowNull: false },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('question_cards');
  },
};