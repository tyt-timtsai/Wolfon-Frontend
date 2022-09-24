import React from 'react';
import {
  Button, Modal, Box,
} from '@mui/material';
import './uploadModal.css';

function UploadModal({
  open, file, upload, handleClose, handleUpload,
}) {
  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box id="upload-modal-container">
        <div className="upload-upload-preview">
          {file ? (
            <img className="upload-img" src={URL.createObjectURL(file)} alt="upload file" />
          ) : <p className="upload-upload-text">上傳背景圖片</p>}
        </div>
        <div className="upload-modal-btn">
          {file ? (
            <p>{file.name}</p>
          ) : null}
          <Button variant="outlined" component="label">
            上傳圖片
            <input hidden accept="image/*" type="file" onChange={handleUpload} />
          </Button>
          <Button variant="contained" component="label" onClick={upload}>
            送出
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default UploadModal;
