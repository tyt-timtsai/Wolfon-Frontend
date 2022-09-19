import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import AdjustIcon from '@mui/icons-material/Adjust';
// import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import './header.css';
import LiveCreate from '../../page/live/createLive';

function Header() {
  const navigate = useNavigate();

  const JWT = window.localStorage.getItem('JWT');
  const logout = () => {
    window.localStorage.removeItem('JWT');
    navigate('/');
  };
  return (
    <div id="header-container">
      <div id="header-container-box">
        <a href="/" id="logo-container">
          {/* <img src="/wolf-emblem.png" alt="logo" id="logo-img" /> */}
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
              <SearchRoundedIcon sx={{ transition: 'var(--main-transition)', '&:hover': { color: 'var(--link-color)' } }} fontSize="medium" />
            </Button>
          </a>
          <a href="/live" className="hover-underline">
            <Button sx={{ color: 'var(--link-color)' }} type="button">Live List</Button>
          </a>
          { JWT ? (
            <>
              <LiveCreate />
              <a href="/post/create" className="hover-underline">
                <Button sx={{ color: 'var(--link-color)' }} type="button">new Post</Button>
              </a>
              <a href="/user/profile" className="hover-underline">
                <Button sx={{ color: 'var(--link-color)' }} type="button">Profile</Button>
              </a>
              <Button type="button" color="error" onClick={logout}>Logout</Button>
            </>
          ) : (
            <a href="/user/login" className="hover-underline">
              <Button sx={{ color: 'var(--link-color)' }} type="button">login</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
