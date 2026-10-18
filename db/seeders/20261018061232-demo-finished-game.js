'use strict';

const { QueryTypes } = require('sequelize');

const JOIN_CODE = '204099';
const SET_TITLE = 'Demo General Science';
const START = new Date('2026-10-10T09:00:00Z');
const END = new Date('2026-10-10T09:10:00Z'); // 10-minute match

// One finished game, Solo mode. Three players complete it, one leaves early.
// Ana and Ben-vs-Dan show a tie (Ben and Dan both finish on 600).
const PLAYERS = [
  { email: 'ana.demo@cardclash.test', nickname: 'AnaAce', token: 'demo-token-ana', playerStatus: 'completed', score: 800, hp: 3, revivals: 0, status: 'finished' },
  { email: 'ben.demo@cardclash.test', nickname: 'BenBolt', token: 'demo-token-ben', playerStatus: 'completed', score: 600, hp: 1, revivals: 0, status: 'finished' },
  { email: 'cara.demo@cardclash.test', nickname: 'CaraComet', token: 'demo-token-cara', playerStatus: 'completed', score: 390, hp: 1, revivals: 1, status: 'finished' },
  // Awkward case: left before the timer ended
  { email: 'dan.demo@cardclash.test', nickname: 'DanDash', token: 'demo-token-dan', playerStatus: 'left', score: 600, hp: 3, revivals: 0, status: 'left' },
];

const select = (qi, sql, replacements = {}) =>
  qi.sequelize.query(sql, { type: QueryTypes.SELECT, replacements });

module.exports = {
  async up(queryInterface) {
    const found = await select(queryInterface, 'SELECT id FROM game_sessions WHERE join_code = :code', { code: JOIN_CODE });
    if (found.length > 0) return; // already seeded: change nothing

    const [set] = await select(queryInterface, 'SELECT id FROM question_sets WHERE title = :t', { t: SET_TITLE });

    await queryInterface.bulkInsert('game_sessions', [
      { join_code: JOIN_CODE, question_set_id: set.id, mode: 'solo', status: 'CLOSED', started_at: START, ended_at: END },
    ]);
    const [session] = await select(queryInterface, 'SELECT id FROM game_sessions WHERE join_code = :code', { code: JOIN_CODE });

    const users = await select(queryInterface, 'SELECT user_id, email FROM users WHERE email IN (:emails)', {
      emails: PLAYERS.map((p) => p.email),
    });
    const userId = Object.fromEntries(users.map((u) => [u.email, u.user_id]));

    // seat: one seat per account per game
    await queryInterface.bulkInsert(
      'seat',
      PLAYERS.map((p, i) => ({
        game: session.id,
        user_id: userId[p.email],
        nickname: p.nickname,
        score: p.score,
        seat_number: i + 1,
        joined_at: START,
      }))
    );

    await queryInterface.bulkInsert(
      'players',
      PLAYERS.map((p) => ({ session_id: session.id, nickname: p.nickname, token: p.token, status: p.playerStatus }))
    );
    const players = await select(queryInterface, 'SELECT id, nickname FROM players WHERE session_id = :id', { id: session.id });
    const playerId = Object.fromEntries(players.map((r) => [r.nickname, r.id]));

    await queryInterface.bulkInsert(
      'participants',
      PLAYERS.map((p) => ({
        session_id: session.id,
        type: 'solo',
        name: p.nickname,
        score: p.score,
        hp: p.hp,
        revival_count: p.revivals,
        status: p.status,
      }))
    );
    const participants = await select(queryInterface, 'SELECT id, name FROM participants WHERE session_id = :id', { id: session.id });
    const participantId = Object.fromEntries(participants.map((r) => [r.name, r.id]));

    await queryInterface.bulkInsert(
      'participant_members',
      PLAYERS.map((p) => ({ participant_id: participantId[p.nickname], player_id: playerId[p.nickname] }))
    );
    await queryInterface.bulkInsert(
      'decks',
      PLAYERS.map((p) => ({ participant_id: participantId[p.nickname], status: 'closed' }))
    );
  },

  async down(queryInterface) {
    // seat, players, participants, members, decks, cards, answers, results... all cascade from the session
    await queryInterface.sequelize.query('DELETE FROM game_sessions WHERE join_code = :code', {
      replacements: { code: JOIN_CODE },
    });
  },
};