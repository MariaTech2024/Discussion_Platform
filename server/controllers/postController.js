import {
  getPostsByChannelId,
  createPost,
  updatePost,
  deletePost,
} from '../models/postModel.js';

// Get posts for a specific channel
const getPosts = async (req, res) => {
  const { channelId } = req.params;

  try {
    const posts = await getPostsByChannelId(channelId);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

// Create a new post for a specific channel
const createNewPost = async (req, res) => {
  const { channelId } = req.params;
  const { userId, body } = req.body;

  try {
    const post = await createPost(channelId, userId, body);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Update a post
const updateExistingPost = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  try {
    const post = await updatePost(id, body);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete a post
const deleteExistingPost = async (req, res) => {
  const { id } = req.params;

  try {
    await deletePost(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

export { getPosts, createNewPost, updateExistingPost, deleteExistingPost };