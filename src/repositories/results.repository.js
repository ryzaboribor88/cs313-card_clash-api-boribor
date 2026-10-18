// Hub Contract rule 7. YOUR WORK (Lab Step 9): write the query for YOUR tables.
//
// Return one row per player per FINISHED game (a game whose status is CLOSED,
// or whatever your design calls a game that has ended), with exactly these names:
//
//   session_code   the six-digit join code of the game
//   started_at     when the game started (may be null)
//   ended_at       when the game ended
//   school_id      the player's school ID, from your users table
//   nickname       the nickname the player used in that game
//   score          the player's final score
//   completed      true or false: did this player complete the game?
//                  YOUR game decides what "completed" means. Write the rule
//                  in your README, for example "answered every question".
//
// If "since" is given, return only games that ended after it.
//
// An example for a design with game_sessions, players and users tables:
//
//   SELECT s.join_pin AS session_code, s.started_at, s.ended_at,
//          u.school_id, p.nickname, p.score,
//          (p.finished_at IS NOT NULL) AS completed
//     FROM game_sessions s
//     JOIN players p ON p.session_id = s.session_id
//     JOIN users u ON u.user_id = p.user_id
//    WHERE s.status = 'CLOSED'
//      AND (CAST(:since AS timestamptz) IS NULL OR s.ended_at > :since)
//    ORDER BY s.ended_at, p.score DESC
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT gs.join_code AS session_code,
           gs.started_at,
           gs.ended_at,
           u.school_id,
           s.nickname,
           s.score,
           COALESCE(p.status = 'completed', FALSE) AS completed
      FROM game_sessions gs
      JOIN seat s ON s.game = gs.id
      JOIN users u ON u.user_id = s.user_id
      LEFT JOIN players p ON p.session_id = gs.id AND p.nickname = s.nickname
     WHERE gs.status = 'CLOSED'
       AND gs.ended_at IS NOT NULL
       AND (CAST(:since AS timestamptz) IS NULL OR gs.ended_at > :since)
     ORDER BY gs.ended_at, s.score DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { since: since ? since.toISOString() : null },
  });
}

module.exports = { findFinishedGamePlayers };
