import express from 'express';
import {
  getChannels,
  getChannel,
  createNewChannel,
  updateExistingChannel,
  deleteExistingChannel,
} from '../controllers/channelController.js';

const channelRouter = express.Router();

// Get all channels
channelRouter.get('/', getChannels);

channelRouter.get('/:id', getChannel); 

// Create a new channel
channelRouter.post('/', createNewChannel);

// Update an existing channel
channelRouter.put('/:id', updateExistingChannel);

// Delete a channel
channelRouter.delete('/:id', deleteExistingChannel);

export default channelRouter;