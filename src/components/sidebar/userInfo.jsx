import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Paper, IconButton, Avatar, Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import constants from '../../global/constants';
import UploadModal from '../userAsset/uploadModal';
import './userInfo.css';

function UserInfo({ userData, isSetting, isPost }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpload = (e) => setFile(e.target.files[0]);

  const upload = () => {
    if (file && userData) {
      const formData = new FormData();
      formData.append('type', 'avatar');
      formData.append('image', file);
      axios.post(
        constants.UPLOAD_IMAGE_API,
        formData,
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
          },
        },
      ).then((res) => {
        window.localStorage.setItem('JWT', res.data.data);
        navigate(0);
      }).catch((err) => {
        console.log(err);
      });
    }

    setFile(null);
    handleClose();
  };

  useEffect(() => {
    setFile(null);
    console.log(userData);
  }, []);

  return (
    <Paper elevation={2} sx={{ maxWidth: 256 }} id="home-left-sidebar">
      {isSetting ? (
        <>
          <Avatar
            alt="User"
            src={userData.photo ? `${constants.IMAGE_URL}/${userData.photo}` : null}
            id="sidebar-avatar"
            style={{ cursor: 'default' }}
          />
          <IconButton
            id="sidebar-avatar-edit-icon"
            aria-label="upload picture"
            component="label"
            onClick={handleOpen}
          >
            <EditIcon />
          </IconButton>
          <UploadModal
            open={open}
            file={file}
            upload={upload}
            handleClose={handleClose}
            handleUpload={handleUpload}
          />
        </>
      ) : (
        <div>
          {userData && (
          <Avatar
            alt="User"
            src={userData.photo ? `${constants.IMAGE_URL}/${userData.photo}` : null}
            id="sidebar-avatar"
            onClick={() => navigate(`/user/${userData.id}`)}
          />
          )}
        </div>
      )}

      {userData
        ? (
          <div id="sidebar-user-info">
            <p id="sidebar-user-name">{userData.name}</p>
            <div className="sidebar-user-assets">
              <div className="sidebar-user-number">
                {userData.lives.length}
                {' '}
                <p className="sidebar-user-text">Lives</p>
              </div>
              <div className="sidebar-user-number">
                {userData.posts.length}
                {' '}
                <p className="sidebar-user-text">Posts</p>
              </div>
            </div>

            <div className="sidebar-user-number">
              {userData.followers.length}
              {' '}

              <p className="sidebar-user-text">Followers</p>
            </div>
            <div className="sidebar-user-created">
              {userData.created_dt.slice(0, -4)}
              {' '}
              <p className="sidebar-user-text">Joined</p>
            </div>
          </div>
        ) : (
          <p> 尚未登入 </p>
        )}
      {isPost && (
      <Button
        variant="contained"
        style={{ marginTop: 2 }}
        onClick={() => navigate(`/user/${userData.id}`)}
      >
        Author Profile
      </Button>
      )}
    </Paper>
  );
}

export default UserInfo;
