import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; 
import './SideBar.css';

const SideBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any authentication-related data
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar__logo">
                <img src={logo} alt="App Logo" />
            </div>
            <h2 className="sidebar__title">Discussion Platform</h2>
            <ul className="sidebar__menu">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/channels">Channels</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </div>
    );
};

export default SideBar;