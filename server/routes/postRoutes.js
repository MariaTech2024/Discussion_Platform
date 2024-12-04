import express from 'express';
import {
  getPosts,
  createNewPost,
  updateExistingPost,
  deleteExistingPost,
} from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.get('/:channelId', getPosts);
postRouter.post('/:channelId', createNewPost);
postRouter.put('/:id', updateExistingPost);
postRouter.delete('/:id', deleteExistingPost);

export default postRouter;