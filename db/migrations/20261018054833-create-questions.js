'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_set_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'question_sets', key: 'id' }, onDelete: 'CASCADE' },
      text: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING(20), allowNull: false },
      time_limit_sec: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },
      difficulty: { type: Sequelize.STRING(10), allowNull: false },
    });
    await queryInterface.addConstraint('questions', { type: 'check', name: 'questions_difficulty_check', fields: ['difficulty'], where: { difficulty: { [Sequelize.Op.in]: ['green', 'yellow', 'red'] } } });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};