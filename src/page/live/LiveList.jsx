import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LiveListItem from '../../components/video/LiveListItem';
import constants from '../../global/constants';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import './liveList.css';

function LiveList() {
  const [lives, setLives] = useState([]);
  useEffect(() => {
    axios.get(constants.GET_LIVE_API)
      .then((res) => {
        console.log(res);
        setLives(res.data.liveData);
      })
      .catch(((err) => {
        console.log(err);
      }));
  }, []);
  return (
    <>
      <Header />
      <div id="live-list-container">
        <h1>LiveList</h1>
        <div id="live-list-item-container">
          {lives ? lives.reverse().map((live) => (
            <LiveListItem
              live={live}
          // eslint-disable-next-line no-underscore-dangle
              key={live._id}
            />
          )) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LiveList;
