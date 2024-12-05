import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import deleteIcon from "../../assets/trash.png";
import likedIcon from "../../assets/thumb.png";
import chattingIcon from "../../assets/chatting.png";
import "./PostList.css";

const PostList = () => {
  const { channelId } = useParams(); 
  const { id } = useParams();
  const [channelName, setChannelName] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newPostBody, setNewPostBody] = useState("");
  const [newCommentBody, setNewCommentBody] = useState({});
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [replies, setReplies] = useState({});
const [newReplyBody, setNewReplyBody] = useState({}); 
const [showReplies, setShowReplies] = useState({});

  // Fetch channel name, posts and comments when the component is mounted
  useEffect(() => {
    if (!channelId) {
      console.error("Channel ID is undefined");
      return;
    }
  
    const fetchChannel = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/channels/${channelId}`);
        const data = await response.json();
       
        if (data && data.name) {
          setChannelName(data);  
        } else {
          console.error('No name found in the channel data');
        }
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    };
  
    fetchChannel();
  
    const fetchPostsAndComments = async () => {
      try {
        const postsResponse = await axios.get(`http://localhost:5000/api/posts/${channelId}`);
        const postsWithLikes = postsResponse.data.map((post) => ({
          ...post,
          likes: post.likes != null && !isNaN(post.likes) ? post.likes : 0,
        }));
        setPosts(postsWithLikes);
  
        const commentsPromises = postsResponse.data.map(async (post) => {
          const commentsResponse = await axios.get(`http://localhost:5000/api/comments/${post.id}`);
          return { postId: post.id, comments: commentsResponse.data };
        });
  
        const allComments = await Promise.all(commentsPromises);
        const commentsObj = allComments.reduce((acc, { postId, comments }) => {
          acc[postId] = comments;
          return acc;
        }, {});
  
        setComments(commentsObj);
      } catch (error) {
        console.error("Error fetching posts or comments", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPostsAndComments();
  }, [channelId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostBody) return;

    try {
      const userId = 1; 
      const response = await axios.post(
        `http://localhost:5000/api/posts/${channelId}`,
        { userId, body: newPostBody }
      );
      setPosts([response.data, ...posts]);
      setNewPostBody("");
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  const handleAddComment = async (postId) => {
    const body = newCommentBody[postId];

    if (!body) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments/${postId}`,
        { body, userId: 1 }
      ); 
      setComments({
        ...comments,
        [postId]: [response.data, ...comments[postId]],
      });
      setNewCommentBody({ ...newCommentBody, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      setComments({
        ...comments,
        [postId]: comments[postId].filter(
          (comment) => comment.id !== commentId
        ),
      });
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/replies/${commentId}`);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching replies", error);
    }
  };

  const handleAddReply = async (commentId) => {
    const body = newReplyBody[commentId];
  
    if (!body) return;
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/replies/${commentId}`,
        { body, userId: 1 } 
      );
  
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: [response.data, ...(prevReplies[commentId] || [])],
      }));
  
      setNewReplyBody({ ...newReplyBody, [commentId]: "" });
    } catch (error) {
      console.error("Error adding reply", error);
    }
  };


  const handleLikeToggle = (postId) => {
    const isCurrentlyLiked = userLikes[postId] === "liked";

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: Number(post.likes) + (isCurrentlyLiked ? -1 : 1) }
          : post
      )
    );

    setUserLikes({
      ...userLikes,
      [postId]: isCurrentlyLiked ? "" : "liked",
    });
  };

  const handleToggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleToggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], 
    }));
  };

  
  const filteredPosts = posts.filter((post) =>
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="post-list-container">
  <h2>Welcome to the Channel <span>{channelName?.name || 'Loading...'}!</span></h2>
  {/* Search Input */}
  <div className="search-wrapper">
    <input
      type="text"
      placeholder="Search for questions and answers..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <form className="create-post-form" onSubmit={handleCreatePost}>
    <textarea
      value={newPostBody}
      onChange={(e) => setNewPostBody(e.target.value)}
      placeholder="Write a new question..."
      required
    />
    <button type="submit">Create Question</button>
  </form>

  <div className="post-card-container">
    {filteredPosts.length === 0 ? (
      <p className="no-posts-message">No posts available.</p>
    ) : (
      filteredPosts.map((post) => (
        <div key={post.id} className="post-card">
          <p className="post-author">
            <img className="user-avatar" src={profilePicture} alt="Profile" />
            {post.username}
          </p>
          <p className="post-body">{post.body}</p>

          <div className="post-actions">
            <p>{post.likes}</p>
            <button onClick={() => handleLikeToggle(post.id)} className="like-button">
              <img
                src={userLikes[post.id] === "liked" ? likedIcon : likedIcon}
                alt="Like Button"
                className="like-icon"
              />
            </button>
            <p className="comment-count" onClick={() => handleToggleComments(post.id)}>
              {comments[post.id] ? `${comments[post.id].length}` : "No Comments"}
              <img src={chattingIcon} alt="Chatting Icon" className="chatting-icon" />
            </p>
          </div>

          {showComments[post.id] && comments[post.id] && (
            <div className="comment-section">
              <ul>
                {comments[post.id].map((comment) => (
                  <li key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <p className="comment-author">
                        <img className="user-avatar" src={profilePicture} alt="Profile" />
                        {comment.username}:
                      </p>
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="delete-icon"
                        onClick={() => handleDeleteComment(comment.id, post.id)}
                      />
                    </div>
                    <p>{comment.body}</p>

                  {/* Replies Section */}
                  <div className="reply-section">
 
  <button onClick={() => handleToggleReplies(comment.id)}>
    {showReplies[comment.id] ? "Hide Replies" : "View Replies"}
  </button>

  {showReplies[comment.id] && replies[comment.id] && (
    <ul className="reply-list">
      {replies[comment.id].map((reply) => (
        <li key={reply.id} className="reply-card">
          <div className="reply-header">
            <img className="user-avatar" src={profilePicture} alt="Profile" />
            <div className="reply-content">
              <p className="reply-author">
                <strong>{reply.username}</strong>
              </p>
              <p>{reply.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )}
        <textarea
          value={newReplyBody[comment.id] || ""}
          onChange={(e) =>
            setNewReplyBody({ ...newReplyBody, [comment.id]: e.target.value })
          }
          placeholder="Write a reply..."
        />
        <button onClick={() => handleAddReply(comment.id)}>Reply</button>
      </div>
    </li>
  ))}
</ul>
            </div>
          )}

          <div className="comment-form">
            <div className="textarea-wrapper">
              <textarea
                value={newCommentBody[post.id] || ""}
                onChange={(e) =>
                  setNewCommentBody({
                    ...newCommentBody,
                    [post.id]: e.target.value,
                  })
                }
                placeholder="Write a comment..."
              />
              <button
                className="emoji-button"
                onClick={() =>
                  setShowEmojiPicker((prev) => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }
              >
                😊
              </button>

              {showEmojiPicker[post.id] && (
                <div className="emoji-picker">
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setNewCommentBody({
                        ...newCommentBody,
                        [post.id]: (newCommentBody[post.id] || "") + emoji.emoji,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              className="add-comment-btn"
              onClick={() => handleAddComment(post.id)}
            >
              Add Comment
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>
    
  );
};

export default PostList;