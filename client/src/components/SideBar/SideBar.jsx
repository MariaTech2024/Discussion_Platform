import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';

const SideBar = ({ }) => {
    return (
        <div className="sidebar">
            <h2 className="sidebar__title">Chat App</h2>
            <ul className="sidebar__menu">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/channels">Channels</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
};

export default SideBar;