'use strict';

const { QueryTypes } = require('sequelize');

const JOIN_CODE = '204099';
const START = new Date('2026-10-10T09:00:00Z');
const at = (min, sec = 0) => new Date(START.getTime() + min * 60000 + sec * 1000);

const select = (qi, sql, replacements = {}) =>
  qi.sequelize.query(sql, { type: QueryTypes.SELECT, replacements });

module.exports = {
  async up(queryInterface) {
    const [session] = await select(queryInterface, 'SELECT id FROM game_sessions WHERE join_code = :code', { code: JOIN_CODE });
    const already = await select(queryInterface, 'SELECT id FROM aid_requests WHERE session_id = :id', { id: session.id });
    if (already.length > 0) return; // already seeded: change nothing

    const participants = await select(queryInterface, 'SELECT id, name FROM participants WHERE session_id = :id', { id: session.id });
    const pid = Object.fromEntries(participants.map((r) => [r.name, r.id]));

    // Cara hit 0 HP at minute 5 and asked Ana for aid (10-second window). Ana accepted.
    await queryInterface.bulkInsert('aid_requests', [
      {
        session_id: session.id,
        requester_id: pid.CaraComet,
        target_id: pid.AnaAce,
        status: 'accepted',
        expires_at: at(5, 10),
      },
    ]);
    const [aid] = await select(queryInterface, 'SELECT id FROM aid_requests WHERE session_id = :id', { id: session.id });

    // Outcome 1 (20% retained): Cara had 450 before elimination, keeps 90, lost 360. Ana pays 100.
    await queryInterface.bulkInsert('revivals', [
      {
        aid_request_id: aid.id,
        aiding_participant_id: pid.AnaAce,
        outcome: 1,
        revival_cost: 100,
        points_before_revival: 450,
        points_retained: 90,
        points_transferred: 0,
        processed_at: at(5, 6),
      },
    ]);
    const [revival] = await select(queryInterface, 'SELECT id FROM revivals WHERE aid_request_id = :id', { id: aid.id });

    // Comeback Challenge: 3 correct x 100 = 300, under the 360 recovery ceiling. Final 90 + 300 = 390.
    await queryInterface.bulkInsert('comeback_challenges', [
      {
        revival_id: revival.id,
        participant_id: pid.CaraComet,
        time_limit_sec: 20,
        points_lost: 360,
        points_recovered: 300,
        status: 'completed',
        started_at: at(5, 7),
        ended_at: at(5, 27),
      },
    ]);
    const [challenge] = await select(queryInterface, 'SELECT id FROM comeback_challenges WHERE revival_id = :id', { id: revival.id });

    const questions = await select(
      queryInterface,
      'SELECT id FROM questions WHERE text IN (:texts) ORDER BY id',
      {
        texts: [
          'Which planet is known as the Red Planet?',
          'What is the chemical formula of water?',
          'Which organelle is the powerhouse of the cell? HAHAHA',
        ],
      }
    );
    await queryInterface.bulkInsert(
      'comeback_cards',
      questions.map((q) => ({ challenge_id: challenge.id, question_id: q.id, fixed_points: 100, status: 'answered' }))
    );

    // Final results (Ana 800 = 900 earned - 100 revival cost). Ben and Dan tie on 600.
    await queryInterface.bulkInsert('game_results', [
      { session_id: session.id, participant_id: pid.AnaAce, final_score: 800, final_hp: 3, correct_answers: 3, wrong_answers: 0, power_cards_used: 0, revivals_used: 0, comeback_points: 0, final_status: 'completed' },
      { session_id: session.id, participant_id: pid.BenBolt, final_score: 600, final_hp: 1, correct_answers: 2, wrong_answers: 1, power_cards_used: 0, revivals_used: 0, comeback_points: 0, final_status: 'completed' },
      { session_id: session.id, participant_id: pid.CaraComet, final_score: 390, final_hp: 1, correct_answers: 2, wrong_answers: 1, power_cards_used: 0, revivals_used: 1, comeback_points: 300, final_status: 'completed' },
      { session_id: session.id, participant_id: pid.DanDash, final_score: 600, final_hp: 3, correct_answers: 2, wrong_answers: 0, power_cards_used: 0, revivals_used: 0, comeback_points: 0, final_status: 'left' },
    ]);
  },

  async down(queryInterface) {
    const [session] = await select(queryInterface, 'SELECT id FROM game_sessions WHERE join_code = :code', { code: JOIN_CODE });
    if (!session) return;
    await queryInterface.sequelize.query('DELETE FROM game_results WHERE session_id = :id', { replacements: { id: session.id } });
    // revivals, comeback_challenges and comeback_cards cascade from the aid request
    await queryInterface.sequelize.query('DELETE FROM aid_requests WHERE session_id = :id', { replacements: { id: session.id } });
  },
};