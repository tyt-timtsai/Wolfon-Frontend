import React from 'react';
import {
  Paper, ListItemIcon, Avatar,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import './sidebar.css';

function Sidebar({ userData }) {
  return (
    <div className="home-sidebar">
      { userData ? (
        <Paper elevation={2} sx={{ maxWidth: 256 }} id="home-left-sidebar">
          <Avatar alt="User" id="sidebar-avatar" />
          <div id="sidebar-user-info">
            <p>{userData.name}</p>

            { userData.likes.length > 0
              ? (
                <p>
                  likes :
                  {' '}
                  {userData.likes.length}
                </p>
              ) : (
                null
              )}
            { userData.fellowers.length > 0
              ? (
                <p>
                  fellowers :
                  {' '}
                  {userData.fellowers.length}
                </p>
              ) : (
                null
              )}

            <p>
              JOINED :
              {' '}
              {userData.created_dt}
            </p>
          </div>
        </Paper>
      ) : null}

      <div className="sidebar-links">
        <div className="sidebar-link">
          <ListItemIcon sx={{ color: '#fff' }}>
            <Settings />
          </ListItemIcon>
          <p> LIVE</p>
        </div>
        <div className="sidebar-link">
          <ListItemIcon sx={{ color: '#fff' }}>
            <Settings />
          </ListItemIcon>
          <p> FRIEND</p>
        </div>
        <div className="sidebar-link">
          <ListItemIcon sx={{ color: '#fff' }}>
            <Settings />
          </ListItemIcon>
          <p> POST</p>
        </div>
        <div className="sidebar-link">
          <ListItemIcon sx={{ color: '#fff' }} className="sidebar-link-icon">
            <Settings />
          </ListItemIcon>
          <p> COMMUNITY</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
