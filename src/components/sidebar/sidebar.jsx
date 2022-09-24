/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItemIcon } from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import { CgProfile } from 'react-icons/cg';
import UserInfo from './userInfo';
import './sidebar.css';

function Sidebar({ userData, isSetting }) {
  const navigate = useNavigate();

  return (
    <div className="home-sidebar">
      { userData ? (
        <UserInfo
          userData={userData}
          isSetting={isSetting}
        />
      ) : null}

      <div className="sidebar-links">
        <div className="sidebar-link" onClick={() => navigate(`/user/${userData.id}`)}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <CgProfile style={{ width: 24, height: 24, color: 'var(--main-color)' }} />
          </ListItemIcon>
          <p> PROFILE</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/asset/live')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <SmartDisplayIcon sx={{ color: 'var(--main-record-color)' }} />
          </ListItemIcon>
          <p> LIVE</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/asset/post')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <ArticleIcon sx={{ color: 'var(--main-focus-color)' }} />
          </ListItemIcon>
          <p> POST</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/asset/friend')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <PeopleIcon sx={{ color: '#ffb74d' }} />
          </ListItemIcon>
          <p> FRIEND</p>
        </div>

        <div className="sidebar-link" onClick={() => navigate('/user/asset/community')}>
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
