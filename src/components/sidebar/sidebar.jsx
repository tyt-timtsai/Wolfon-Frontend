/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ListItemIcon } from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
// import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PushPinIcon from '@mui/icons-material/PushPin';
import GroupsIcon from '@mui/icons-material/Groups';
import { CgProfile } from 'react-icons/cg';
import UserInfo from './userInfo';
import './sidebar.css';

function Sidebar({ userData, isSetting, location }) {
  const navigate = useNavigate();

  const handleNavigate = (prop) => () => {
    if (userData) {
      switch (prop) {
        case 'home':
          navigate('/');
          break;
        case 'profile':
          navigate('/user/profile');
          break;
        case 'live':
          navigate('/user/asset/live');
          break;
        case 'post':
          navigate('/user/asset/post');
          break;
        case 'likePost':
          navigate('/user/asset/likePost');
          break;
        case 'followPost':
          navigate('/user/asset/followPost');
          break;
        case 'friend':
          navigate('/user/asset/friend');
          break;
        case 'follow':
          navigate('/user/asset/follow');
          break;
        case 'follower':
          navigate('/user/asset/follower');
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
        <div className={location === 'home' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('home')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <HomeIcon style={{ width: 24, height: 24, color: 'var(--main-color)' }} />
          </ListItemIcon>
          <p> HOME</p>
        </div>

        <div className={location === 'profile' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('profile')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <CgProfile style={{ width: 24, height: 24, color: 'var(--main-color)' }} />
          </ListItemIcon>
          <p> PROFILE</p>
        </div>

        <hr style={{ width: '96%' }} />

        <div className={location === 'live' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('live')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <SmartDisplayIcon sx={{ color: 'var(--main-record-color)' }} />
          </ListItemIcon>
          <p> LIVE</p>
        </div>

        <div className={location === 'post' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('post')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <ArticleIcon sx={{ color: 'var(--mui-blue-2)' }} />
          </ListItemIcon>
          <p> POST</p>
        </div>

        <div className={location === 'likePost' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('likePost')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <FavoriteIcon sx={{ color: 'var(--mui-red)' }} />
          </ListItemIcon>
          <p> LIKE POST</p>
        </div>

        <div className={location === 'followPost' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('followPost')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <BookmarkIcon sx={location === 'followPost' ? { color: 'var(--main-color)' } : { color: 'var(--main-focus-color)' }} />
          </ListItemIcon>
          <p> FOLLOW POST</p>
        </div>

        <div className={location === 'friend' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('friend')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <PeopleIcon sx={{ color: '#ffb74d' }} />
          </ListItemIcon>
          <p> FRIEND</p>
        </div>

        <div className={location === 'follow' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('follow')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <PushPinIcon sx={{ color: 'var(--mui-blue-1)' }} />
          </ListItemIcon>
          <p> FOLLOW</p>
        </div>

        <div className={location === 'follower' ? 'sidebar-link sidebar-active' : 'sidebar-link'} onClick={handleNavigate('follower')}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <GroupsIcon sx={{ color: 'var(--mui-green)' }} />
          </ListItemIcon>
          <p> FOLLOWER</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
