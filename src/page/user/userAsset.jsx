/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../../components/header/header';
import Sidebar from '../../components/sidebar/sidebar';
import UserLiveItem from '../../components/userAsset/userLiveItem';
import PostList from '../../components/post/Post_list';
import UserFriendItem from '../../components/userAsset/userFriendItem';
import Footer from '../../components/footer/footer';
import constants from '../../global/constants';
import './userAsset.css';

function UserAsset() {
  const params = useParams();
  const navigate = useNavigate();
  const [assets, setAssets] = useState(null);
  const [category, setCategory] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [userData, setUserData] = useState(null);
  const token = window.localStorage.getItem('JWT');

  function getLive() {
    axios.get(constants.GET_USER_LIVE_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      setAssets(res.data.data.reverse());
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      setIsFetching(false);
    });
  }

  function getPost() {
    axios.get(constants.GET_USER_POST_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      setAssets(res.data.data.reverse());
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      setIsFetching(false);
    });
  }

  function getLikePost() {
    axios.get(constants.GET_USER_LIKE_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      setAssets(res.data.data.reverse());
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      setIsFetching(false);
    });
  }

  function getFollowPost() {
    axios.get(constants.GET_USER_FOLLOW_POST_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      setAssets(res.data.data.reverse());
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      setIsFetching(false);
    });
  }

  function getFriend() {
    axios.get(constants.GET_USER_FRIEND_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      const { friends, pendingFriends } = res.data.data;
      setAssets({
        friends,
        pendingFriends,
      });
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      if (err.response.status === 403 || err.response.status === 401) {
        window.localStorage.removeItem('JWT');
        navigate('/user/login');
      }
      setIsFetching(false);
    });
  }

  function getFollow() {
    axios.get(constants.GET_USER_FOLLOW_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      setAssets(res.data.data.follows.reverse());
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      if (err.response.status === 403 || err.response.status === 401) {
        window.localStorage.removeItem('JWT');
        navigate('/user/login');
      }
      setIsFetching(false);
    });
  }

  function getFollower() {
    axios.get(constants.GET_USER_FOLLOWER_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      setAssets(res.data.data.followers.reverse());
      setIsFetching(false);
    }).catch((err) => {
      console.log(err);
      if (err.response.status === 403 || err.response.status === 401) {
        window.localStorage.removeItem('JWT');
        navigate('/user/login');
      }
      setIsFetching(false);
    });
  }

  useEffect(() => {
    if (!token) {
      navigate('/user/login');
    } else {
      axios.get(constants.PROFILE_API, {
        headers: {
          authorization: token,
        },
      })
        .then((res) => {
          setUserData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403 || err.response.status === 400) {
            window.localStorage.removeItem('JWT');
            navigate('/user/login');
          }
        });
    }
    setCategory(params.id);
  }, []);

  useEffect(() => {
    setAssets(null);
    setCategory(params.id);
  }, [params]);

  useEffect(() => {
    setIsFetching(true);
    switch (category) {
      case 'live':
        getLive();
        break;
      case 'post':
        getPost();
        break;
      case 'likePost':
        getLikePost();
        break;
      case 'followPost':
        getFollowPost();
        break;
      case 'friend':
        getFriend();
        break;
      case 'follow':
        getFollow();
        break;
      case 'follower':
        getFollower();
        break;

      default:
        break;
    }
  }, [category]);
  console.log(assets);
  return (
    <>
      <Header />

      <div id="user-asset-container">
        <Sidebar
          userData={userData}
          location={category}
        />
        <div id="user-asset-content-container">

          {isFetching ? (
            <Box sx={{ display: 'flex', marginLeft: '49%' }}>
              <CircularProgress size={30} color="inherit" />
            </Box>
          ) : (
            <>
              {category === 'live' && assets != null ? (
                <div className="asset-live-container">
                  {assets[0] ? assets.map((live) => (
                    <UserLiveItem
                      live={live}
                      key={live._id}
                    />
                  )) : <p className="no-assets-text">No Live</p>}
                </div>
              ) : null}

              {category === 'post' && assets != null ? (
                <div className="post-list-item-container">
                  {assets[0] ? assets.map((post) => (
                    <PostList
                      key={post._id}
                      post={post}
                    />
                  )) : <p className="no-assets-text">No Post</p>}
                </div>
              ) : null}

              {category === 'likePost' && assets != null ? (
                <div className="post-list-item-container">
                  {assets[0] ? assets.map((post) => (
                    <PostList
                      key={post._id}
                      post={post}
                    />
                  )) : <p className="no-assets-text">No Like Post</p>}
                </div>
              ) : null}

              {category === 'followPost' && assets != null ? (
                <div className="post-list-item-container">
                  {assets[0] ? assets.map((post) => (
                    <PostList
                      key={post._id}
                      post={post}
                    />
                  )) : <p className="no-assets-text">No Follow Post</p>}
                </div>
              ) : null}

              {category === 'friend' && assets != null ? (
                <div className="friend-list-item-container">
                  {assets.pendingFriends[0] && assets.pendingFriends.length >= 0
                    ? (
                      <>
                        <p className="friend-list-label">Applicants</p>
                        <div className="friend-list-items">
                          {assets.pendingFriends.map((friend) => (
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
                  {assets.friends[0] && assets.friends.length > 0
                    ? (
                      <>
                        <p className="friend-list-label">Friends</p>
                        <div className="friend-list-items">
                          {assets.friends.map((friend) => (
                            <UserFriendItem
                              key={friend._id}
                              friend={friend}
                              isFriend
                            />
                          ))}
                        </div>
                      </>
                    )
                    : <p className="no-assets-text">No Friend</p>}
                </div>
              ) : null}

              {category === 'follow' && assets != null ? (
                <div className="friend-list-item-container">
                  {assets[0] && assets.length > 0
                    ? (
                      <>
                        <p className="friend-list-label">Follow Users</p>
                        <div className="friend-list-items">
                          {assets.map((user) => (
                            <UserFriendItem
                              key={user._id}
                              friend={user}
                              isFriend={userData.friends.includes(user._id)}
                              assets={assets}
                              setAssets={setAssets}
                            />
                          ))}
                        </div>
                      </>
                    )
                    : <p className="no-assets-text">No Follow</p>}
                </div>
              ) : null}

              {category === 'follower' && assets != null ? (
                <div className="friend-list-item-container">
                  {assets[0] && assets.length > 0
                    ? (
                      <>
                        <p className="friend-list-label">Followers</p>
                        <div className="friend-list-items">
                          {assets.map((user) => (
                            <UserFriendItem
                              key={user._id}
                              friend={user}
                              isFriend={userData.friends.includes(user._id)}
                              assets={assets}
                              setAssets={setAssets}
                            />
                          ))}
                        </div>
                      </>
                    )
                    : <p className="no-assets-text">No Follower</p>}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>

  );
}

export default UserAsset;
