import { pool } from '../config/db.js';

// Get all channels
const getAllChannels = async () => {
  const result = await pool.query('SELECT * FROM channels');
  return result.rows;
};

const getChannelById = async (channelId) => {
  const result = await pool.query('SELECT * FROM channels WHERE id = $1', [channelId]);
  return result.rows[0]; // Assuming only one channel is returned
};

// Create a new channel
const createChannel = async (name, description) => {
  const result = await pool.query(
    'INSERT INTO channels (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
};

// Update a channel
const updateChannel = async (id, name, description) => {
  const result = await pool.query(
    'UPDATE channels SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return result.rows[0]; // Return the updated channel
};

// Delete a channel
const deleteChannel = async (id) => {
  const result = await pool.query('DELETE FROM channels WHERE id = $1 RETURNING *', [id]);
  return result.rows[0]; // Return the deleted channel for confirmation
};

export { getAllChannels, getChannelById, createChannel, updateChannel, deleteChannel };