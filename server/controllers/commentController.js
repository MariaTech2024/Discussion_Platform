import {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
  } from '../models/commentModel.js';
  
  // Get comments for a specific post
  const getComments = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await getCommentsByPostId(postId);
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching comments' });
    }
  };
  
  // Create a new comment
  const createNewComment = async (req, res) => {
    const { postId } = req.params;
    const { userId, body } = req.body;
  
    try {
      const comment = await createComment(postId, userId, body);
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: 'Error creating comment' });
    }
  };
  
  // Update a comment
  const updateExistingComment = async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
  
    try {
      const comment = await updateComment(id, body);
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json({ error: 'Error updating comment' });
    }
  };
  
  // Delete a comment
  const deleteExistingComment = async (req, res) => {
    const { id } = req.params;
  
    try {
      await deleteComment(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Error deleting comment' });
    }
  };
  
  export { getComments, createNewComment, updateExistingComment, deleteExistingComment };