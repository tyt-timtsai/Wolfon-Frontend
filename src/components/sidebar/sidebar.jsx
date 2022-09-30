/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ListItemIcon } from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
// import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import { CgProfile } from 'react-icons/cg';
import UserInfo from './userInfo';
import './sidebar.css';

function Sidebar({ userData, isSetting }) {
  const navigate = useNavigate();

  const handleNavigate = (prop) => () => {
    if (userData) {
      switch (prop) {
        case 'profile':
          navigate(`/user/${userData.id}`);
          break;
        case 'live':
          navigate('/user/asset/live');
          break;
        case 'post':
          navigate('/user/asset/post');
          break;
        case 'friend':
          navigate('/user/asset/friend');
          break;

        default:
          navigate(`/user/${userData.id}`);
          break;
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: '請先登入',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Login',
        confirmButtonColor: 'var(--main-button-color)',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/user/login');
        }
      });
    }
  };

  return (
    <div className="home-sidebar">
      <UserInfo
        userData={userData}
        isSetting={isSetting}
      />

      <div className="sidebar-links">
        <div className="sidebar-link" onClick={handleNavigate('profile')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <CgProfile style={{ width: 24, height: 24, color: 'var(--main-color)' }} />
          </ListItemIcon>
          <p> PROFILE</p>
        </div>

        <div className="sidebar-link" onClick={handleNavigate('live')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <SmartDisplayIcon sx={{ color: 'var(--main-record-color)' }} />
          </ListItemIcon>
          <p> LIVE</p>
        </div>

        <div className="sidebar-link" onClick={handleNavigate('post')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <ArticleIcon sx={{ color: 'var(--main-focus-color)' }} />
          </ListItemIcon>
          <p> POST</p>
        </div>

        <div className="sidebar-link" onClick={handleNavigate('friend')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <PeopleIcon sx={{ color: '#ffb74d' }} />
          </ListItemIcon>
          <p> FRIEND</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
