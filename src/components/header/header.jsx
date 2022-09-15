import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './header.css';

function Header() {
  const navigate = useNavigate();

  const JWT = window.localStorage.getItem('JWT');
  const logout = () => {
    window.localStorage.removeItem('JWT');
    navigate('/');
  };
  return (
    <div id="header-container">
      <Box id="header-container-box" elevation={3} sx={{ flexGrow: 1 }}>
        <a href="/" id="logo-container">
          <img src="/wolf-emblem.png" alt="logo" id="logo-img" />
          <div id="logo-text">
            Wolf
            {' '}
            <div id="logo-span" />
            n
          </div>
        </a>

        <div id="header-links">
          <a href="/search">
            <Button type="button" size="small">
              <SearchRoundedIcon fontSize="medium" />
            </Button>
          </a>
          <a href="/live" className="hover-underline">
            <Button type="button">Live List</Button>
          </a>
          <a href="/live/streamer" className="hover-underline">
            <Button type="button">Streamer</Button>
          </a>
          <a href="/live/room1" className="hover-underline">
            <Button type="button">Viewer</Button>
          </a>
          { JWT ? (
            <>
              <a href="/post/create" className="hover-underline">
                <Button type="button">new Post</Button>
              </a>
              <a href="/user/profile" className="hover-underline">
                <Button type="button">Profile</Button>
              </a>
              <Button type="button" color="error" onClick={logout}>Logout</Button>
            </>
          ) : (
            <a href="/user/login" className="hover-underline">
              <Button type="button">login</Button>
            </a>
          )}
        </div>
      </Box>
    </div>
  );
}

export default Header;
