import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const url = "https://discussion-platform-one.vercel.app";
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem('profilePicture') || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
      } else {
        try {
          const response = await axios.get(`${url}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (err) {
          setError('Failed to fetch profile. Please log in again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        localStorage.setItem('profilePicture', base64String); 
        setProfilePicture(base64String); 
      };
      reader.readAsDataURL(file); 
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Profile</h2>
      {profilePicture ? (
        <img
          src={profilePicture}
          alt="Profile"
          style={{ width: '150px', height: '150px', borderRadius: '50%' }}
        />
      ) : (
        <p>No profile picture set.</p>
      )}
      <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <button
  onClick={() => {
    localStorage.removeItem('token');
    navigate('/auth');
  }}
  style={{
    backgroundColor: ' #1b3d74', 
    color: 'white', 
    border: 'none', 
    padding: '8px 15px', 
    fontSize: '14px', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    transition: 'background-color 0.3s ease',
    textAlign: 'center'
  }}
>
  Logout
</button>
    </div>
  );
};

export default Profile;