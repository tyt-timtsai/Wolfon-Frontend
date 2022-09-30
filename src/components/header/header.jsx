import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import './header.css';
import LiveCreate from '../../page/live/createLive';

function Header() {
  const navigate = useNavigate();
  const JWT = window.localStorage.getItem('JWT');

  const logout = () => {
    window.localStorage.removeItem('JWT');
    navigate('/user/login');
  };

  return (
    <div id="header-container">
      <div id="header-container-box">
        <a href="/" id="logo-container">
          <div id="logo-text">
            Wolf
            {' '}
            <div id="logo-span">
              <div id="logo-span-circle" />
            </div>
            n
          </div>
        </a>

        <div id="header-links">
          <a href="/search" id="header-search-icon">
            <SearchRoundedIcon sx={{ transition: 'var(--main-transition)', '&:hover': { color: 'var(--link-color)' } }} fontSize="medium" />
          </a>
          { JWT ? (
            <>
              <LiveCreate />
              <a href="/post/create" className="hover-underline">
                <Button sx={{ color: 'var(--link-color)' }} type="button">new Post</Button>
              </a>
              <a href="/user/setting" className="hover-underline">
                <Button sx={{ color: 'var(--main-focus-color)' }} type="button">Setting</Button>
              </a>
              <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <a
              href="/user/login"
              className="login-btn"
            >
              <Button
                sx={{ color: 'var(--link-color)', border: '1px solid var(--link-color)' }}
                variant="outlined"
                type="button"
              >
                login
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
