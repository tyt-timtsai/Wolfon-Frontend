import React from 'react';
import {
  Modal, Box,
} from '@mui/material';
import { GiCancel } from 'react-icons/gi';
import constants from '../../global/constants';
import './imageModal.css';

function ImageModal({
  open, index, imageUrl, handleClose,
}) {
  return (
    <Modal
      keepMounted
      open={open === `${index}`}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box id="image-modal-container">
        <button type="button" onClick={handleClose} className="modal-close-btn">
          <GiCancel id="stream-upload-cancel-icon" />
        </button>
        <div className="image-preview">
          {imageUrl ? (
            <img className="upload-img" src={`${constants.IMAGE_URL}/${imageUrl}`} alt="upload file" />
          ) : <p className="upload-upload-text">上傳背景圖片</p>}
        </div>
      </Box>
    </Modal>
  );
}

export default ImageModal;
