import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  
import './ChannelList.css';


const ChannelList = () => {
    const url = "https://discussion-platform-one.vercel.app";
    const [channels, setChannels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newChannel, setNewChannel] = useState('');
    const [newChannelDescription, setNewChannelDescription] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); 

  
    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await axios.get(`${url}/api/channels`);
                setChannels(response.data);
            } catch (err) {
                console.error('Error fetching channels:', err);
            }
        };

        fetchChannels();
    }, []);

  
    const filteredChannels = channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddChannel = async () => {
        if (newChannel.trim() === '' || newChannelDescription.trim() === '') {
            alert('Both channel name and description are required.');
            return;
        }

        if (channels.some((channel) => channel.name.toLowerCase() === newChannel.toLowerCase())) {
            alert('Channel already exists.');
            return;
        }

        try {
            
            const response = await axios.post(`${url}/api/channels`, {
                name: newChannel,
                description: newChannelDescription,
            });

            setChannels([...channels, response.data]);
            setNewChannel('');
            setNewChannelDescription('');
            setIsDropdownOpen(false); 
        } catch (err) {
            console.error('Error creating channel:', err);
            alert('Error creating channel.');
        }
    };

    const handleChannelClick = (channelId) => {
        navigate(`/channel/${channelId}`); 
    };

    return (
        <div className="channels-container">
            <h1>Channels</h1>
            <input
                type="text"
                className="search-input"
                placeholder="Search for channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="dropdown-container">
                <button 
                    className="add-channel-button" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="plus-icon">+</span> Create Channel
                </button>

                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <input
                            type="text"
                            className="channel-input"
                            placeholder="Enter channel name..."
                            value={newChannel}
                            onChange={(e) => setNewChannel(e.target.value)}
                        />
                        <textarea
                            className="channel-description-input"
                            placeholder="Enter channel description..."
                            value={newChannelDescription}
                            onChange={(e) => setNewChannelDescription(e.target.value)}
                        ></textarea>
                        <button className="add-channel-submit" onClick={handleAddChannel}>
                            Add Channel
                        </button>
                    </div>
                )}
            </div>

            <div className="channel-cards">
                {filteredChannels.length > 0 ? (
                    filteredChannels.map((channel, index) => (
                        <div 
                            key={index} 
                            className="channel-card" 
                            onClick={() => handleChannelClick(channel.id)} 
                        >
                            <h3 className="channel-name">{channel.name}</h3>
                            <p className="channel-description">{channel.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No channels found.</p>
                )}
            </div>
        </div>
    );
};

export default ChannelList;