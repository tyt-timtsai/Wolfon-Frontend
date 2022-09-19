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
import constants from '../../global/constants';
import './userLiveItem.css';

function UserLiveItem({ live }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/live/streamer/${live.room_id}`);
  };

  return (
    <Card id="user-live-card">
      <CardMedia
        component="img"
        height="194"
        image={`${constants.SERVER_URL}/${live.cover_img}` || 'https://logos-world.net/wp-content/uploads/2021/02/Docker-Symbol.png'}
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
    </Card>
  );
}

export default UserLiveItem;
