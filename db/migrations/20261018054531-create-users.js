'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      school_id: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      full_name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      role: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'player' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addConstraint('users', { type: 'check', name: 'users_role_check', fields: ['role'], where: { role: { [Sequelize.Op.in]: ['host', 'player'] } } });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};