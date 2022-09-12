import React from 'react';
import { Paper, Button } from '@mui/material';
import './header.css';

function Header() {
  return (
    <Paper id="header-container" elevation={3}>
      <a href="/" id="logo-container">
        <img src="/wolf-emblem.png" alt="logo" id="logo-img" />
        <p id="logo-text">
          Wolf
          {' '}
          <span id="logo-span">on</span>
        </p>
      </a>
      <div id="header-links">
        <a href="/live/streamer">
          <Button type="button">Streamer</Button>
        </a>
        <a href="/live/room1">
          <Button type="button">Viewer</Button>
        </a>
        <a href="/user/login">
          <Button type="button">login</Button>
        </a>
        <a href="/user/profile">
          <Button type="button">Profile</Button>
        </a>
        <a href="/post/create">
          <Button type="button">new Post</Button>
        </a>
        <a href="/search">
          <Button type="button">Search</Button>
        </a>
      </div>
    </Paper>
  );
}

export default Header;
