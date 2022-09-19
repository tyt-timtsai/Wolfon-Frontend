import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header/header';
import UserLiveItem from '../../components/userAsset/userLiveItem';
import UserPostItem from '../../components/userAsset/userPostItem';
import Footer from '../../components/footer/footer';
import constants from '../../global/constants';
import './userAsset.css';

function UserAsset() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const params = useParams();
  const [category, setCategory] = useState('');
  const jwt = window.localStorage.getItem('JWT');

  const handleCategory = (e) => {
    if (category !== e.target.value) {
      setAssets(null);
      setCategory(e.target.value);
    }
  };

  function getLive() {
    axios.get(constants.GET_USER_LIVE_API, {
      headers: {
        authorization: jwt,
      },
    }).then((res) => {
      setAssets(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }
  function getPost() {
    axios.get(constants.GET_USER_POST_API, {
      headers: {
        authorization: jwt,
      },
    }).then((res) => {
      setAssets(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }
  function getFriend() {
    axios.get(constants.GET_USER_FRIEND_API, {
      headers: {
        authorization: jwt,
      },
    }).then((res) => {
      console.log(res.data.data);
      // setAssets(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }
  function getCommunity() {
    axios.get(constants.GET_USER_COMMUNITY_API, {
      headers: {
        authorization: jwt,
      },
    }).then((res) => {
      console.log(res.data.data);
      // setAssets(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    if (!jwt) {
      navigate('/user/login');
    }
    setCategory(params.id);
  }, []);

  useEffect(() => {
    if (category) {
      navigate(`/user/asset/${category}`);
    }

    switch (category) {
      case 'live':
        getLive();
        break;
      case 'post':
        getPost();
        break;
      case 'friend':
        getFriend();
        break;
      case 'community':
        getCommunity();
        break;

      default:
        break;
    }
  }, [category]);
  return (
    <>
      <Header />
      <div id="user-asset-container">
        <div id="user-asset-btns">
          <button
            type="button"
            className="user-asset-btn"
            value="live"
            onClick={handleCategory}
          >
            LIVE
          </button>
          <button
            type="button"
            className="user-asset-btn"
            value="post"
            onClick={handleCategory}
          >
            POST
          </button>
          <button
            type="button"
            className="user-asset-btn"
            value="friend"
            onClick={handleCategory}
          >
            FRIEND
          </button>
          <button
            type="button"
            className="user-asset-btn"
            value="community"
            onClick={handleCategory}
          >
            COMMUNITY
          </button>
        </div>
        {category === 'live' ? (
          <div className="live-list-item-container">
            {assets ? assets.reverse().map((live) => (
              <UserLiveItem
                live={live}
          // eslint-disable-next-line no-underscore-dangle
                key={live._id}
              />
            )) : null}
          </div>
        ) : null}
        {category === 'post' ? (
          <div className="post-list-item-container">
            {assets ? assets.reverse().map((post) => (
              <UserPostItem
                // eslint-disable-next-line no-underscore-dangle
                key={post._id}
                post={post}
              />
            )) : null}
          </div>
        ) : null}
        {category === 'friend' ? (
          <div className="friend-list-item-container">
            <p>friend</p>
          </div>
        ) : null}
        {category === 'community' ? (
          <div className="community-list-item-container">
            <p>community</p>
          </div>
        ) : null}

      </div>
      <Footer />
    </>

  );
}

export default UserAsset;
