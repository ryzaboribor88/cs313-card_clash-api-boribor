'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('participant_members', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      participant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      player_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'players', key: 'id' }, onDelete: 'CASCADE' },
    });
    await queryInterface.addConstraint('participant_members', { type: 'unique', name: 'participant_members_unique', fields: ['participant_id', 'player_id'] });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('participant_members');
  },
};