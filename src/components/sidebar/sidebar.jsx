/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import {
  Paper, ListItemIcon, Avatar,
} from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import './sidebar.css';
import { useNavigate } from 'react-router-dom';

function Sidebar({ userData }) {
  const navigate = useNavigate();

  return (
    <div className="home-sidebar">
      { userData ? (
        <Paper elevation={2} sx={{ maxWidth: 256 }} id="home-left-sidebar">
          <Avatar alt="User" id="sidebar-avatar" />
          <div id="sidebar-user-info">
            <p id="sidebar-user-name">{userData.name}</p>

            { userData.likes.length > 0
              ? (
                <p>
                  fellowers :
                  {' '}
                  {userData.fellowers.length}
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
        <div className="sidebar-link" onClick={() => navigate('/user/live')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <SmartDisplayIcon sx={{ color: 'var(--main-record-color)' }} />
          </ListItemIcon>
          <p> LIVE</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/post')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <ArticleIcon sx={{ color: 'var(--main-focus-color)' }} />
          </ListItemIcon>
          <p> POST</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/friend')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <PeopleIcon sx={{ color: '#ffb74d' }} />
          </ListItemIcon>
          <p> FRIEND</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/community')}>
          <ListItemIcon sx={{ color: '#fff' }} className="sidebar-link-icon">
            <GroupsIcon sx={{ color: '#81c784' }} />
          </ListItemIcon>
          <p> COMMUNITY</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
