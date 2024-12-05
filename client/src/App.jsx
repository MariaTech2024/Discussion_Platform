import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Profile from './components/Profile/Profile.jsx';
import SideBar from './components/SideBar/SideBar.jsx';
import ChannelList from './components/Channels/ChannelList.jsx';
import './App.css';
import Auth from './components/Auth/Auth.jsx';
import PostList from './components/Posts/PostList.jsx';

const App = () => {
    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div style={{ padding: '20px', flex: 1 }}>
                <Routes>
                <Route path="/" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/channels" element={<ChannelList />} />
                    <Route path="/channel/:channelId" element={<PostList />} />
                </Routes>
            </div>
        </div>
      );
    }
    export default App;