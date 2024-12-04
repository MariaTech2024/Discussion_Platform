import express from 'express';
import { getReplies, createReply, updateReply, deleteReply } from '../controllers/replyController.js';

const replyRouter = express.Router();

// Route to get all replies for a specific comment
replyRouter.get('/:commentId', getReplies);

// Route to create a new reply for a specific comment
replyRouter.post('/:commentId', createReply);

// Route to update an existing reply
replyRouter.put('/:id', updateReply);

// Route to delete a reply
replyRouter.delete('/:id', deleteReply);

export default replyRouter;