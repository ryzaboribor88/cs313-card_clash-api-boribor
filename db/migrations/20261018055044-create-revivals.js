'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('revivals', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      aid_request_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'aid_requests', key: 'id' }, onDelete: 'CASCADE' },
      aiding_participant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'participants', key: 'id' }, onDelete: 'CASCADE' },
      outcome: { type: Sequelize.INTEGER, allowNull: false },
      revival_cost: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 100 },
      points_before_revival: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      points_retained: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      points_transferred: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      processed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addConstraint('revivals', { type: 'check', name: 'revivals_outcome_check', fields: ['outcome'], where: { outcome: { [Sequelize.Op.between]: [1, 3] } } });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('revivals');
  },
};