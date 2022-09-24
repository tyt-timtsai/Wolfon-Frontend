/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header/header';
import UserLiveItem from '../../components/userAsset/userLiveItem';
// import UserPostItem from '../../components/userAsset/userPostItem';
import PostList from '../../components/post/Post_list';
import UserFriendItem from '../../components/userAsset/userFriendItem';
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
      const { friends, pendingFriends } = res.data.data;
      setAssets({ friends, pendingFriends });
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
    setAssets(null);
    setCategory(params.id);
  }, []);

  useEffect(() => {
    if (category) {
      navigate(`/user/asset/${category}`);
    }
    console.log(category);
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
            className={`${category === 'live' ? 'btn-active' : ''} user-asset-btn`}
            value="live"
            onClick={handleCategory}
          >
            LIVE
          </button>
          <button
            type="button"
            className={`${category === 'post' ? 'btn-active' : ''} user-asset-btn`}
            value="post"
            onClick={handleCategory}
          >
            POST
          </button>
          <button
            type="button"
            className={`${category === 'friend' ? 'btn-active' : ''} user-asset-btn`}
            value="friend"
            onClick={handleCategory}
          >
            FRIEND
          </button>
          <button
            type="button"
            className={`${category === 'community' ? 'btn-active' : ''} user-asset-btn`}
            value="community"
            onClick={handleCategory}
          >
            COMMUNITY
          </button>
        </div>
        {category === 'live' && assets != null ? (
          <div className="live-list-item-container">
            {assets ? assets.reverse().map((live) => (
              <UserLiveItem
                live={live}
                key={live._id}
              />
            )) : null}
          </div>
        ) : null}
        {category === 'post' && assets != null ? (
          <div className="post-list-item-container">
            {assets ? assets.reverse().map((post) => (
              <PostList
                key={post._id}
                post={post}
              />
            )) : <p className="friend-list-label">目前尚無文章</p>}
          </div>
        ) : null}

        {category === 'friend' && assets != null ? (
          <div className="friend-list-item-container">
            {assets && assets.pendingFriends.length > 0
              ? (
                <>
                  <p className="friend-list-label">好友申請</p>
                  <div className="friend-list-items">
                    {assets.pendingFriends.reverse().map((friend) => (
                      <UserFriendItem
                        key={friend._id}
                        friend={friend}
                        isFriend={false}
                        assets={assets}
                        setAssets={setAssets}
                      />
                    ))}
                  </div>
                </>
              )
              : null}
            {assets && assets.friends.length > 0
              ? (
                <>
                  <p className="friend-list-label">好友</p>
                  <div className="friend-list-items">
                    {assets.friends.reverse().map((friend) => (
                      <UserFriendItem
                        key={friend._id}
                        friend={friend}
                        isFriend
                      />
                    ))}
                  </div>
                </>
              )
              : null}
          </div>
        ) : null}

        {category === 'community' && assets != null ? (
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
