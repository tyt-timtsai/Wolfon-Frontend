import React from 'react';
import {
  Paper, List, ListItemButton, ListItemText, ListItemIcon, Avatar,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import './sidebar.css';

function Sidebar() {
  return (
    <div className="home-sidebar">
      <Paper elevation={2} sx={{ maxWidth: 256 }} id="home-left-sidebar">
        <Avatar alt="User" id="sidebar-avatar" />
      </Paper>

      <List component="nav" aria-label="main mailbox folders" id="sidebar-list">
        <ListItemButton
          key="Friend"
          sx={{ py: 0, minHeight: 32, color: 'black' }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Friend"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
          />
        </ListItemButton>
        <ListItemButton
          key="Post"
          sx={{ py: 0, minHeight: 32, color: 'black' }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Post"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
          />
        </ListItemButton>
        <ListItemButton
          key="Community"
          sx={{ py: 0, minHeight: 32, color: 'black' }}
        >
          <ListItemIcon sx={{ color: 'black' }}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Community"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
          />
        </ListItemButton>
      </List>
    </div>
  );
}

export default Sidebar;
