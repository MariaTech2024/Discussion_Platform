import * as Reply from '../models/replyModel.js';

// Get all replies for a specific comment
const getReplies = async (req, res) => {
  const { commentId } = req.params;

  try {
    const replies = await Reply.getRepliesByCommentId(commentId);
    res.status(200).json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Error fetching replies' });
  }
};

// Create a new reply for a specific comment
const createReply = async (req, res) => {
  const { commentId } = req.params;
  const { userId, body } = req.body;

  try {
    const newReply = await Reply.createReply(commentId, userId, body);
    res.status(201).json(newReply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Error creating reply' });
  }
};

// Update an existing reply
const updateReply = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  try {
    const updatedReply = await Reply.updateReply(id, body);
    res.status(200).json(updatedReply);
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({ error: 'Error updating reply' });
  }
};

// Delete a reply
const deleteReply = async (req, res) => {
  const { id } = req.params;

  try {
    await Reply.deleteReply(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ error: 'Error deleting reply' });
  }
};

export { getReplies, createReply, updateReply, deleteReply };