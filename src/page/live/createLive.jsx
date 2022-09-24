import React, { useState } from 'react';
import {
  TextField,
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './createLive.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const labelStyle = {
  paddingLeft: 2,
  paddingRight: 2,
  color: 'var(--link-color)',
  bgcolor: 'var(--secondary-bg-color)',
};

const selectStyle = {
  color: 'var(--link-color)',
};

const inputStyle = {
  color: 'var(--link-color)',
  borderRadius: 1,
  width: '75%',
  marginLeft: 1,
  marginTop: 2,
  marginBottom: 1,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tag = [
  'Javascript',
  'Python',
  'Golang',
  'Docker',
  'Git',
  'Shell',
  'Terminal',
  'Network',
  'Talk & Share',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
  };
}

function LiveCreate() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [image, setImage] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme();

  const handleInput = (e) => {
    setTitle(e.target.value);
  };

  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setLanguage(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleUpload = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('language', language);
    formData.append('image', image);
    const header = {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    };
    try {
      const result = await axios.post(constants.CREATE_LIVE_API, formData, header);
      console.log(result);
      navigate(`/live/streamer/${result.data.liveData.room_id}`);
    } catch (error) {
      console.log(error);
    }
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
              <Button variant="contained" component="label" onClick={handleCreate}>
                建立直播
              </Button>
            </div>

            <Typography sx={{ mt: 2 }}>
              請選擇直播類型 :
            </Typography>

            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel sx={labelStyle} id="tag-label">直播類型</InputLabel>
              <Select
                labelId="tag-label"
                value={language}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="tag-label" />}
                MenuProps={MenuProps}
                sx={selectStyle}
              >
                {tag.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, language, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography sx={{ mt: 2 }}>
              請輸入直播名稱 :
            </Typography>
            <TextField
              label="直播名稱"
              variant="outlined"
              sx={inputStyle}
              InputLabelProps={{
                style: { color: 'var(--main-content-color)' },
              }}
              onChange={handleInput}
            />
            <div id="create-live-upload">
              <Button variant="outlined" component="label">
                上傳封面
                <input hidden accept="image/*" type="file" onChange={handleUpload} />
              </Button>
              {image ? (
                <Typography>
                  {image.name}
                </Typography>
              ) : null}
            </div>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default LiveCreate;
