'use strict';

const { QueryTypes } = require('sequelize');

const SET_TITLE = 'Demo General Science';

// Points follow the game concept: Team 100/200/300, Solo 150/300/450
const POINTS = {
  green: { team: 100, solo: 150 },
  yellow: { team: 200, solo: 300 },
  red: { team: 300, solo: 450 },
};

const QUESTIONS = [
  { text: 'Which planet is known as the Red Planet?', difficulty: 'green', correct: 1, choices: ['Venus', 'Mars', 'Jupiter', 'Mercury'] },
  { text: 'What is the chemical formula of water?', difficulty: 'green', correct: 0, choices: ['H2O', 'CO2', 'O2', 'NaCl'] },
  { text: 'Which gas do plants absorb for photosynthesis?', difficulty: 'yellow', correct: 2, choices: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'] },
  { text: 'Which organelle is the powerhouse of the cell?', difficulty: 'yellow', correct: 3, choices: ['Nucleus', 'Ribosome', 'Golgi body', 'Mitochondrion'] },
  { text: 'What is the SI unit of force?', difficulty: 'red', correct: 1, choices: ['Joule', 'Newton', 'Watt', 'Pascal'] },
  { text: 'Which subatomic particle has a negative charge?', difficulty: 'red', correct: 0, choices: ['Electron', 'Proton', 'Neutron', 'Photon'] },
];

const POWER_CARDS = [
  { name: 'Point Steal', type: 'attack', description: 'Take points from a target Participant.', effect: 'steal_points' },
  { name: 'Double Points', type: 'power_up', description: 'Doubles the reward of the next correct answer.', effect: 'double_next_reward' },
  { name: 'Shield', type: 'protection', description: 'Blocks the next negative effect.', effect: 'block_negative' },
];

const select = (qi, sql, replacements = {}) =>
  qi.sequelize.query(sql, { type: QueryTypes.SELECT, replacements });

module.exports = {
  async up(queryInterface) {
    const found = await select(queryInterface, 'SELECT id FROM question_sets WHERE title = :t', { t: SET_TITLE });
    if (found.length > 0) return; // already seeded: change nothing

    await queryInterface.bulkInsert('question_sets', [
      { title: SET_TITLE, description: 'Fictitious demo questions for Card Clash.', subject: 'Science', grade_level: 'Grade 10' },
    ]);
    const [set] = await select(queryInterface, 'SELECT id FROM question_sets WHERE title = :t', { t: SET_TITLE });

    await queryInterface.bulkInsert(
      'questions',
      QUESTIONS.map((q) => ({
        question_set_id: set.id,
        text: q.text,
        type: 'multiple_choice',
        time_limit_sec: 20,
        difficulty: q.difficulty,
      }))
    );
    const stored = await select(queryInterface, 'SELECT id, text FROM questions WHERE question_set_id = :id', { id: set.id });
    const questionId = Object.fromEntries(stored.map((r) => [r.text, r.id]));

    const choiceRows = [];
    const cardRows = [];
    for (const q of QUESTIONS) {
      q.choices.forEach((label, index) => {
        choiceRows.push({
          question_id: questionId[q.text],
          choice_index: index,
          choice_text: label,
          is_correct: index === q.correct,
        });
      });
      cardRows.push({
        question_id: questionId[q.text],
        difficulty: q.difficulty,
        team_points: POINTS[q.difficulty].team,
        solo_points: POINTS[q.difficulty].solo,
      });
    }
    await queryInterface.bulkInsert('choices', choiceRows);
    await queryInterface.bulkInsert('question_cards', cardRows);
    await queryInterface.bulkInsert('power_cards', POWER_CARDS);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DELETE FROM power_cards WHERE name IN (:names)', {
      replacements: { names: POWER_CARDS.map((p) => p.name) },
    });
    // questions, choices and question_cards go with the set (ON DELETE CASCADE)
    await queryInterface.sequelize.query('DELETE FROM question_sets WHERE title = :t', {
      replacements: { t: SET_TITLE },
    });
  },
};