import { pool } from '../config/db.js';

// Get all replies for a specific comment
const getRepliesByCommentId = async (commentId) => {
  const result = await pool.query(
    `SELECT replies.*, users.username 
     FROM replies 
     JOIN users ON replies.user_id = users.id 
     WHERE replies.comment_id = $1 
     ORDER BY replies.created_at ASC`,
    [commentId]
  );
  return result.rows;
};

// Create a new reply for a specific comment
const createReply = async (commentId, userId, body) => {
  const result = await pool.query(
    'INSERT INTO replies (comment_id, user_id, body) VALUES ($1, $2, $3) RETURNING *',
    [commentId, userId, body]
  );
  return result.rows[0];
};

// Update an existing reply
const updateReply = async (id, body) => {
  const result = await pool.query(
    'UPDATE replies SET body = $1 WHERE id = $2 RETURNING *',
    [body, id]
  );
  return result.rows[0];
};

// Delete a reply
const deleteReply = async (id) => {
  await pool.query('DELETE FROM replies WHERE id = $1', [id]);
};

export { getRepliesByCommentId, createReply, updateReply, deleteReply };