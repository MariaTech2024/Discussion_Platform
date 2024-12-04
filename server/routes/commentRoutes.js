import express from 'express';
import {
  getComments,
  createNewComment,
  updateExistingComment,
  deleteExistingComment,
} from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.get('/:postId', getComments);
commentRouter.post('/:postId', createNewComment);
commentRouter.put('/:id', updateExistingComment);
commentRouter.delete('/:id', deleteExistingComment);

export default commentRouter;