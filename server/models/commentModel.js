import { pool } from '../config/db.js';

// Get all comments for a specific post
const getCommentsByPostId = async (postId) => {
  const result = await pool.query(
    `SELECT comments.*, users.username 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE comments.post_id = $1 
     ORDER BY comments.created_at ASC`,
    [postId]
  );
  return result.rows;
};

// Create a new comment for a specific post
const createComment = async (postId, userId, body) => {
  const result = await pool.query(
    'INSERT INTO comments (post_id, user_id, body) VALUES ($1, $2, $3) RETURNING *',
    [postId, userId, body]
  );
  return result.rows[0];
};

// Update an existing comment
const updateComment = async (id, body) => {
  const result = await pool.query(
    'UPDATE comments SET body = $1 WHERE id = $2 RETURNING *',
    [body, id]
  );
  return result.rows[0];
};

// Delete a comment
const deleteComment = async (id) => {
  await pool.query('DELETE FROM comments WHERE id = $1', [id]);
};

export { getCommentsByPostId, createComment, updateComment, deleteComment };