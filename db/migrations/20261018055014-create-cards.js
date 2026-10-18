'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      deck_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'decks', key: 'id' }, onDelete: 'CASCADE' },
      color: { type: Sequelize.STRING(10), allowNull: false },
      card_type: { type: Sequelize.STRING(10), allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'unrevealed' },
      question_card_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'question_cards', key: 'id' }, onDelete: 'CASCADE' },
      power_card_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'power_cards', key: 'id' }, onDelete: 'SET NULL' },
    });
    await queryInterface.addConstraint('cards', { type: 'check', name: 'cards_color_check', fields: ['color'], where: { color: { [Sequelize.Op.in]: ['green', 'yellow', 'red'] } } });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cards');
  },
};