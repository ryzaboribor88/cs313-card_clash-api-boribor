'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aid_requests', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'game_sessions', key: 'id' }, onDelete: 'CASCADE' },
      requester_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      target_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
      expires_at: { type: Sequelize.DATE, allowNull: false },
    });
    
  },

  async down(queryInterface) {
    await queryInterface.dropTable('aid_requests');
  },
};