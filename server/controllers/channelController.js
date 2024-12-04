import { getAllChannels, getChannelById, createChannel, updateChannel, deleteChannel } from '../models/channelModel.js';

// Get all channels
const getChannels = async (req, res) => {
  try {
    const channels = await getAllChannels();
    res.status(200).json(channels);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching channels' });
  }
};

// Get a single channel by ID
const getChannel = async (req, res) => {
  const { id } = req.params; // Get the channel ID from the URL parameters

  try {
    const channel = await getChannelById(id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.status(200).json(channel); // Send the found channel as the response
  } catch (err) {
    res.status(500).json({ error: 'Error fetching channel' });
  }
};

// Create a new channel
const createNewChannel = async (req, res) => {
  const { name, description } = req.body;

  try {
    const channel = await createChannel(name, description);
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ error: 'Error creating channel' });
  }
};

// Update a channel
const updateExistingChannel = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedChannel = await updateChannel(id, name, description);
    if (!updatedChannel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.status(200).json(updatedChannel);
  } catch (err) {
    res.status(500).json({ error: 'Error updating channel' });
  }
};

// Delete a channel
const deleteExistingChannel = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedChannel = await deleteChannel(id);
    if (!deletedChannel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.status(200).json({ message: 'Channel deleted successfully', deletedChannel });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting channel' });
  }
};

export { getChannels, getChannel, createNewChannel, updateExistingChannel, deleteExistingChannel };