'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_sets', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      subject: { type: Sequelize.STRING(50), allowNull: true },
      grade_level: { type: Sequelize.STRING(30), allowNull: true },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('question_sets');
  },
};