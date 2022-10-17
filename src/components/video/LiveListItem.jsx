/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  // IconButton,
  Typography,
  Button,
} from '@mui/material';
import { blue } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import constants from '../../global/constants';
import './liveListItem.css';

function LiveListItem({ live }) {
  const navigate = useNavigate();
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    setIsStreaming(live.isStreaming);
  }, []);

  const handleJoin = () => {
    navigate(`/live/${live._id}`);
  };

  const handleReview = () => {
    navigate(`/live/review/${live._id}`);
  };

  return (
    <Card id="live-item-card">
      {isStreaming && (
      <div className="live-item-streaming-icon">
        <div className="live-item-streaming-dot" />
        <p className="live-item-streaming-text">Live</p>
      </div>
      )}
      <CardHeader
        avatar={(
          <Avatar
            sx={{ bgcolor: blue[500] }}
            src={live.streamer_photo ? `${constants.IMAGE_URL}/${live.streamer_photo}` : '#'}
            aria-label="User avatar"
          />
        )}
        title={live.streamer}
        subheader={(
          <Typography variant="caption" align="center" sx={{ color: 'var(--main-content-color)' }}>
            {live.created_dt}
          </Typography>
        )}
      />
      <CardMedia
        component="img"
        height="194"
        image={live.cover_img ? `${constants.IMAGE_URL}/${live.cover_img}` : 'https://logos-world.net/wp-content/uploads/2021/02/Docker-Symbol.png'}
        alt="Live theme"
      />
      <CardContent>
        <Typography variant="h6" align="center">
          {live.title || 'Did not set title'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton> */}
        {isStreaming ? (
          <Button className="full-width-btn" variant="contained" onClick={handleJoin}>加入直播</Button>
        ) : (
          <Button className="full-width-btn" variant="contained" onClick={handleReview}>觀看直播錄影</Button>
        )}
      </CardActions>
    </Card>
  );
}

export default LiveListItem;
