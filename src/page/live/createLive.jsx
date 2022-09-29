import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  TextField,
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
} from '@mui/material';
import './createLive.css';
import axios from 'axios';
import constants from '../../global/constants';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'var(--secondary-bg-color)',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const inputStyle = {
  color: 'var(--link-color)',
  borderRadius: 1,
  width: '75%',
  marginTop: 2,
  marginBottom: 2,
};

function LiveCreate() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInput = (e) => {
    setTitle(e.target.value);
  };

  const handleUpload = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    if (!title || title === '') {
      return Swal.fire({
        title: 'Error!',
        text: '請輸入直播名稱',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    if (!image) {
      return Swal.fire({
        title: 'Error!',
        text: '請上傳直播封面',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    formData.append('title', title);
    formData.append('image', image);
    const header = {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    };
    try {
      const result = await axios.post(constants.CREATE_LIVE_API, formData, header);
      console.log(result);
      setOpen(false);
      Swal.fire({
        title: 'Success!',
        text: '直播建立成功',
        icon: 'success',
        confirmButtonText: '進入直播頁面',
        confirmButtonColor: 'var(--main-button-color)',
      }).then(() => {
        navigate(`/live/streamer/${result.data.liveData.room_id}`);
      });
    } catch (error) {
      console.log(error);
      if (error.response.status === 401 || error.response.status === 403) {
        Swal.fire({
          title: 'Error!',
          text: '身份驗證失敗',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: '重新登入',
          confirmButtonColor: 'var(--main-button-color)',
          cancelButtonText: '取消',
        }).then((result) => {
          if (result.isConfirmed) {
            window.localStorage.removeItem('JWT');
            navigate('/user/login');
          }
        });
      }
    }
    return 1;
  };

  return (
    <div className="hover-underline">
      <Button sx={{ color: 'var(--link-color)' }} onClick={handleOpen}>Create Live</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div id="create-live-header">
              <Typography id="transition-modal-title" variant="h6" component="h2">
                建立直播
              </Typography>
            </div>

            <TextField
              label="直播名稱"
              variant="outlined"
              sx={inputStyle}
              InputLabelProps={{
                style: { color: 'var(--main-content-color)' },
              }}
              onChange={handleInput}
            />

            {image ? (
              <img id="create-live-img-preview" src={URL.createObjectURL(image)} alt="" />
            ) : null}

            {image ? (
              <Typography id="create-live-img-name">
                {image.name}
              </Typography>
            ) : null}

            <div id="create-live-upload">
              <Button variant="outlined" component="label">
                上傳封面
                <input hidden accept="image/*" type="file" onChange={handleUpload} />
              </Button>
              <Button variant="contained" component="label" onClick={handleCreate}>
                建立直播
              </Button>
            </div>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default LiveCreate;
