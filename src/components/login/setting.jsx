import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from '../sidebar/sidebar';
import UploadModal from '../userAsset/uploadModal';
import constants from '../../global/constants';

import './setting.css';

function UserSetting() {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpload = (e) => setFile(e.target.files[0]);

  const upload = () => {
    if (file && userData) {
      console.log('upload');
      const formData = new FormData();
      formData.append('type', 'background');
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
    axios.get(constants.PROFILE_API, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
      },
    }).then((res) => {
      setUserData(res.data.data);
    }).catch((err) => {
      console.log('Fetch profile error : ', err);
    });
  }, []);

  useEffect(() => {
    if (userData) {
      console.log(`${userData.background_image}`);
    }
  }, [userData]);

  return (
    <div id="setting-container">
      {userData ? (
        <Sidebar
          userData={userData}
          isSetting
        />
      ) : null}

      <div className="setting-main">
        <div className="setting-img-container">
          {userData
          && (
          <img
            id="setting-user-background"
            src={userData.background_image
              ? `${constants.IMAGE_URL}/${userData.background_image}` : '/profile-background.jpg'}
            alt="background"
          />
          )}
          <IconButton
            id="setting-background-edit-icon"
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
        </div>
        <div className="setting-main-content">
          {userData && (
          <h1>
            Welcome back
            {' '}
            {userData.name}
          </h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSetting;
