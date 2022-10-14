/* eslint-disable no-underscore-dangle */
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import Swal from 'sweetalert2';
import './userLiveItem.css';
import DeleteIcon from '@mui/icons-material/Delete';
import constants from '../../global/constants';

function UserLiveItem({ live }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/live/streamer/${live._id}`);
  };

  const handleReview = () => {
    navigate(`/live/review/${live._id}`);
  };

  function deleteLive() {
    axios.delete(`${constants.DELETE_LIVE_API}/${live._id}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      console.log(res);
      window.localStorage.setItem('JWT', res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this live : ${live.title}`,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Yes, Delete it',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('delete');
        deleteLive();
      }
    });
  };

  return (
    <Card id="user-live-card">
      {live.cover_img
      && (
      <>
        <CardMedia
          component="img"
          height="194"
          image={`${constants.IMAGE_URL}/${live.cover_img}` || 'https://logos-world.net/wp-content/uploads/2021/02/Docker-Symbol.png'}
          alt="Live theme"
        />
        <CardContent>
          <Typography variant="h6" align="center">
            {live.title || 'Did not set title'}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {live.isStreaming ? (
            <Button className="full-width-btn" variant="contained" onClick={handleClick}>進入直播</Button>
          ) : (
            <Button className="full-width-btn" variant="contained" onClick={handleReview}>觀看錄影</Button>
          )}
        </CardActions>
        <IconButton
          className="live-delete-btn"
          aria-label="delete live"
          component="label"
          onClick={handleDelete}
        >
          <DeleteIcon style={{ color: 'var(--main-record-color)' }} />
        </IconButton>
      </>
      )}
    </Card>
  );
}

export default UserLiveItem;
