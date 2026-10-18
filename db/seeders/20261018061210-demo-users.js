'use strict';

const { QueryTypes } = require('sequelize');

// All fictitious: school IDs start with 2099, emails end in .test
const USERS = [
  { school_id: '2099-0001', full_name: 'Demo Host Teacher', email: 'host.demo@cardclash.test', role: 'host' },
  { school_id: '2099-1001', full_name: 'Ana Demo', email: 'ana.demo@cardclash.test', role: 'player' },
  { school_id: '2099-1002', full_name: 'Ben Demo', email: 'ben.demo@cardclash.test', role: 'player' },
  { school_id: '2099-1003', full_name: 'Cara Demo', email: 'cara.demo@cardclash.test', role: 'player' },
  { school_id: '2099-1004', full_name: 'Dan Demo', email: 'dan.demo@cardclash.test', role: 'player' },
  // Awkward case: an account that never joined any game
  { school_id: '2099-1005', full_name: 'Eli Demo', email: 'eli.demo@cardclash.test', role: 'player' },
];

module.exports = {
  async up(queryInterface) {
    const existing = await queryInterface.sequelize.query(
      'SELECT user_id FROM users WHERE email IN (:emails)',
      { type: QueryTypes.SELECT, replacements: { emails: USERS.map((u) => u.email) } }
    );
    if (existing.length > 0) return; // already seeded: change nothing

    const now = new Date();
    await queryInterface.bulkInsert('users', USERS.map((u) => ({ ...u, created_at: now })));
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query("DELETE FROM users WHERE email LIKE '%@cardclash.test'");
  },
};