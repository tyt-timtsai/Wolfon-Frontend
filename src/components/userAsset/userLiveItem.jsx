import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';
import './userLiveItem.css';
import constants from '../../global/constants';

function UserLiveItem({ live }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/live/streamer/${live.room_id}`);
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
          <Button className="full-width-btn" variant="outlined" onClick={handleClick}>Join Stream</Button>
        </CardActions>
      </>
      )}
    </Card>
  );
}

export default UserLiveItem;
