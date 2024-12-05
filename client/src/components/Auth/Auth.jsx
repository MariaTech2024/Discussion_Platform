import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isLogin
      ? 'http://localhost:5000/api/users/login'
      : 'http://localhost:5000/api/users/register';

    try {
      const response = await axios.post(url, {
        username,
        email: isLogin ? undefined : email,
        password,
      });

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        navigate('/channels');
      } else {
        setIsLogin(true);
        setErrorMessage('Registration successful! Please login.');
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
  <div className="auth-card">
    <div className="auth-left">
      <h2>Welcome to the discussion platform!</h2>
      <p>Here, you can ask questions, seek advice, and share your knowledge.
            Get answers to your queries, explore a wide range of topics, and
            contribute to a pool of collective knowledge.</p>
    </div>
    <div className="auth-right">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
  {isLogin ? (
    <>
      Don't have an account? <span className="highlight">Register here</span>
    </>
  ) : (
    <>
      Already have an account? <span className="highlight">Login here</span>
    </>
  )}
</p>
    </div>
  </div>
</div>
  );
};

export default Auth;