import { pool } from '../config/db.js';

// Get all posts for a specific channel
const getPostsByChannelId = async (channelId) => {
  const result = await pool.query(
    `SELECT posts.*, users.username 
     FROM posts 
     JOIN users ON posts.user_id = users.id 
     WHERE posts.channel_id = $1 
     ORDER BY posts.created_at DESC`,
    [channelId]
  );
  return result.rows;
};

// Create a new post for a specific channel
const createPost = async (channelId, userId, body) => {
  const result = await pool.query(
    'INSERT INTO posts (channel_id, user_id, body) VALUES ($1, $2, $3) RETURNING *',
    [channelId, userId, body]
  );
  return result.rows[0];
};

// Update an existing post
const updatePost = async (id, body) => {
  const result = await pool.query(
    'UPDATE posts SET body = $1 WHERE id = $2 RETURNING *',
    [body, id]
  );
  return result.rows[0];
};

// Delete a post
const deletePost = async (id) => {
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
};

export { getPostsByChannelId, createPost, updatePost, deletePost };