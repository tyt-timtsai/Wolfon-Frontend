import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import './liveListItem.css';

function LiveListItem({ live }) {
  console.log(live);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/live/${live.room_id}`);
  };

  return (
    <Card id="live-item-card">
      <CardHeader
        avatar={(
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="User avatar" />
        )}
        title={live.streamer}
        subheader="September 14, 2016"
      />
      <CardMedia
        component={live.video_url ? 'video' : 'img'}
        height="194"
        image={live.video_url || 'https://logos-world.net/wp-content/uploads/2021/02/Docker-Symbol.png'}
        alt="Live theme"
      />
      <CardContent>
        <Typography variant="h6" align="center">
          {live.title || 'Did not set title'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" sx={{ marginRight: '10px' }}>
          <ShareIcon />
        </IconButton>
        <Button className="full-width-btn" variant="outlined" onClick={handleClick}>Join Stream</Button>
      </CardActions>
    </Card>
  );
}

export default LiveListItem;
