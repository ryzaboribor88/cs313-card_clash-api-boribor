'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'questions', key: 'id' }, onDelete: 'CASCADE' },
      choice_index: { type: Sequelize.INTEGER, allowNull: false },
      choice_text: { type: Sequelize.TEXT, allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    });
    await queryInterface.addConstraint('choices', { type: 'unique', name: 'choices_question_index_unique', fields: ['question_id', 'choice_index'] });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('choices');
  },
};