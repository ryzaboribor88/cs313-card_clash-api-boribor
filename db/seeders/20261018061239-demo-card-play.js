'use strict';

const { QueryTypes } = require('sequelize');

const JOIN_CODE = '204099';
const START = new Date('2026-10-10T09:00:00Z');

const SOLO_POINTS = { green: 150, yellow: 300, red: 450 };
const HP_LOSS = { green: -1, yellow: -2, red: -3 };

const Q = {
  mars: 'Which planet is known as the Red Planet?',
  water: 'What is the chemical formula of water?',
  gas: 'Which gas do plants absorb for photosynthesis?',
  cell: 'Which organelle is the powerhouse of the cell?',
  force: 'What is the SI unit of force?',
  charge: 'Which subatomic particle has a negative charge?',
};

// Each participant's card path: position, colour, and what the server revealed.
const CARDS = [
  { who: 'AnaAce', pos: 1, color: 'green', q: Q.mars, status: 'resolved' },
  { who: 'AnaAce', pos: 2, color: 'yellow', q: Q.cell, status: 'resolved' },
  { who: 'AnaAce', pos: 3, color: 'red', q: Q.force, status: 'resolved' },
  { who: 'AnaAce', pos: 4, color: 'yellow', power: 'Double Points', status: 'saved' },

  { who: 'BenBolt', pos: 1, color: 'green', q: Q.water, status: 'resolved' },
  { who: 'BenBolt', pos: 2, color: 'yellow', q: Q.gas, status: 'resolved' },
  { who: 'BenBolt', pos: 3, color: 'red', q: Q.charge, status: 'resolved' },
  { who: 'BenBolt', pos: 4, color: 'green', power: 'Shield', status: 'saved' },

  { who: 'CaraComet', pos: 1, color: 'green', q: Q.mars, status: 'resolved' },
  { who: 'CaraComet', pos: 2, color: 'yellow', q: Q.cell, status: 'resolved' },
  { who: 'CaraComet', pos: 3, color: 'red', q: Q.force, status: 'resolved' },

  { who: 'DanDash', pos: 1, color: 'green', q: Q.water, status: 'resolved' },
  { who: 'DanDash', pos: 2, color: 'red', q: Q.force, status: 'resolved' },
  { who: 'DanDash', pos: 3, color: 'yellow', q: Q.gas, status: 'unrevealed' }, // left before opening it
];

// Answers: minute of the match, and whether it was right.
const ANSWERS = [
  { who: 'AnaAce', pos: 1, correct: true, min: 1 },
  { who: 'AnaAce', pos: 2, correct: true, min: 3 },
  { who: 'AnaAce', pos: 3, correct: true, min: 6 },
  { who: 'BenBolt', pos: 1, correct: true, min: 1 },
  { who: 'BenBolt', pos: 2, correct: false, min: 4 }, // yellow wrong: -2 HP
  { who: 'BenBolt', pos: 3, correct: true, min: 7 },
  { who: 'CaraComet', pos: 1, correct: true, min: 1 },
  { who: 'CaraComet', pos: 2, correct: true, min: 3 },
  { who: 'CaraComet', pos: 3, correct: false, min: 5 }, // red wrong: -3 HP, eliminated
  { who: 'DanDash', pos: 1, correct: true, min: 2 },
  { who: 'DanDash', pos: 2, correct: true, min: 5 },
];

const SAVED_POWER_CARDS = [
  { who: 'AnaAce', pos: 4, power: 'Double Points' },
  { who: 'BenBolt', pos: 4, power: 'Shield' },
];

const select = (qi, sql, replacements = {}) =>
  qi.sequelize.query(sql, { type: QueryTypes.SELECT, replacements });

module.exports = {
  async up(queryInterface) {
    const [session] = await select(queryInterface, 'SELECT id FROM game_sessions WHERE join_code = :code', { code: JOIN_CODE });
    const already = await select(queryInterface, 'SELECT id FROM answers WHERE session_id = :id', { id: session.id });
    if (already.length > 0) return; // already seeded: change nothing

    const participants = await select(queryInterface, 'SELECT id, name FROM participants WHERE session_id = :id', { id: session.id });
    const participantId = Object.fromEntries(participants.map((r) => [r.name, r.id]));
    const players = await select(queryInterface, 'SELECT id, nickname FROM players WHERE session_id = :id', { id: session.id });
    const playerId = Object.fromEntries(players.map((r) => [r.nickname, r.id]));
    const decks = await select(queryInterface, 'SELECT id, participant_id FROM decks WHERE participant_id IN (:ids)', {
      ids: Object.values(participantId),
    });
    const deckByParticipant = Object.fromEntries(decks.map((d) => [d.participant_id, d.id]));

    const texts = Object.values(Q);
    const questionCards = await select(
      queryInterface,
      'SELECT qc.id, q.text FROM question_cards qc JOIN questions q ON q.id = qc.question_id WHERE q.text IN (:texts)',
      { texts }
    );
    const questionCardId = Object.fromEntries(questionCards.map((r) => [r.text, r.id]));
    const correctRows = await select(
      queryInterface,
      'SELECT q.text, c.choice_index FROM choices c JOIN questions q ON q.id = c.question_id WHERE c.is_correct = true AND q.text IN (:texts)',
      { texts }
    );
    const correctIndex = Object.fromEntries(correctRows.map((r) => [r.text, r.choice_index]));
    const powerRows = await select(queryInterface, 'SELECT id, name FROM power_cards');
    const powerId = Object.fromEntries(powerRows.map((r) => [r.name, r.id]));

    await queryInterface.bulkInsert(
      'cards',
      CARDS.map((c) => ({
        deck_id: deckByParticipant[participantId[c.who]],
        color: c.color,
        card_type: c.q ? 'question' : 'power',
        position: c.pos,
        status: c.status,
        question_card_id: c.q ? questionCardId[c.q] : null,
        power_card_id: c.power ? powerId[c.power] : null,
      }))
    );
    const storedCards = await select(queryInterface, 'SELECT id, deck_id, position FROM cards WHERE deck_id IN (:ids)', {
      ids: Object.values(deckByParticipant),
    });
    const cardId = (who, pos) =>
      storedCards.find((c) => c.deck_id === deckByParticipant[participantId[who]] && c.position === pos).id;
    const cardSpec = (who, pos) => CARDS.find((c) => c.who === who && c.pos === pos);

    await queryInterface.bulkInsert(
      'participant_power_cards',
      SAVED_POWER_CARDS.map((s) => ({
        participant_id: participantId[s.who],
        power_card_id: powerId[s.power],
        acquired_card_id: cardId(s.who, s.pos),
        status: 'stored',
        stored_at: new Date(START.getTime() + 8 * 60000),
      }))
    );

    await queryInterface.bulkInsert(
      'answers',
      ANSWERS.map((a) => {
        const card = cardSpec(a.who, a.pos);
        const right = correctIndex[card.q];
        return {
          session_id: session.id,
          card_id: cardId(a.who, a.pos),
          participant_id: participantId[a.who],
          player_id: playerId[a.who],
          selected_choice: a.correct ? right : (right + 1) % 4,
          correct: a.correct,
          points_earned: a.correct ? SOLO_POINTS[card.color] : 0,
          hp_change: a.correct ? 0 : HP_LOSS[card.color],
          answered_at: new Date(START.getTime() + a.min * 60000),
        };
      })
    );
  },

  async down(queryInterface) {
    const [session] = await select(queryInterface, 'SELECT id FROM game_sessions WHERE join_code = :code', { code: JOIN_CODE });
    if (!session) return;
    await queryInterface.sequelize.query('DELETE FROM answers WHERE session_id = :id', { replacements: { id: session.id } });
    await queryInterface.sequelize.query(
      'DELETE FROM participant_power_cards WHERE participant_id IN (SELECT id FROM participants WHERE session_id = :id)',
      { replacements: { id: session.id } }
    );
    await queryInterface.sequelize.query(
      'DELETE FROM cards WHERE deck_id IN (SELECT d.id FROM decks d JOIN participants p ON p.id = d.participant_id WHERE p.session_id = :id)',
      { replacements: { id: session.id } }
    );
  },
};