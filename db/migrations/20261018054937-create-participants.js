'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('participants', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'game_sessions', key: 'id' }, onDelete: 'CASCADE' },
      type: { type: Sequelize.STRING(10), allowNull: false },
      name: { type: Sequelize.STRING(50), allowNull: false },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      hp: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 3 },
      revival_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active' },
    });
    await queryInterface.addConstraint('participants', { type: 'check', name: 'participants_hp_check', fields: ['hp'], where: { hp: { [Sequelize.Op.gte]: 0 } } });
    await queryInterface.addConstraint('participants', { type: 'check', name: 'participants_revival_check', fields: ['revival_count'], where: { revival_count: { [Sequelize.Op.lte]: 2 } } });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('participants');
  },
};