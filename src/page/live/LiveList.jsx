import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import LiveListItem from '../../components/video/LiveListItem';
import constants from '../../global/constants';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import './liveList.css';

function LiveList() {
  const [lives, setLives] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  async function getLives() {
    setIsFetching(true);
    try {
      const result = await axios.get(constants.GET_LIVE_API);
      setLives(result.data.liveData);
    } catch (err) {
      console.log(err);
    }
    setIsFetching(false);
  }

  useEffect(() => {
    getLives();
  }, []);
  return (
    <>
      <Header />
      <div id="live-list-container">
        <h1 id="live-list-header">LiveList</h1>
        {isFetching ? (
          <Box sx={{ position: 'relative', top: 200 }}>
            <CircularProgress size={30} color="inherit" />
          </Box>
        ) : (
          <div className="live-list-item-container">
            {lives && lives.reverse().map((live) => (
              <LiveListItem
                live={live}
            // eslint-disable-next-line no-underscore-dangle
                key={live._id}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default LiveList;
