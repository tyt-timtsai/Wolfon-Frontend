/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import constants from '../../global/constants';
import Header from '../../components/header/header';
import UserLiveItem from '../../components/userAsset/userLiveItem';
import PostList from '../../components/post/Post_list';
import UploadModal from '../../components/userAsset/uploadModal';
import Footer from '../../components/footer/footer';

import './profile.css';

function Profile() {
  const token = window.localStorage.getItem('JWT');
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [category, setCategory] = useState('post');
  const [assets, setAssets] = useState(null);

  const [openBackground, setOpenBackground] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [file, setFile] = useState(null);

  const [isOwn, setIsOwn] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [isApply, setIsApply] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const handleOpenAvatar = () => setOpenAvatar(true);
  const handleOpenBackground = () => setOpenBackground(true);
  const handleClose = () => {
    setOpenAvatar(false);
    setOpenBackground(false);
  };
  const handleUpload = (e) => setFile(e.target.files[0]);

  const uploadAvatar = () => {
    if (file && user && isOwn) {
      console.log('upload');
      const formData = new FormData();
      formData.append('type', 'avatar');
      formData.append('image', file);
      axios.post(
        constants.UPLOAD_IMAGE_API,
        formData,
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
          },
        },
      ).then((res) => {
        window.localStorage.setItem('JWT', res.data.data);
        navigate(0);
      }).catch((err) => {
        console.log(err);
      });
    }
    setFile(null);
    handleClose();
  };

  const uploadBackground = () => {
    if (file && user && isOwn) {
      console.log('upload');
      const formData = new FormData();
      formData.append('type', 'background');
      formData.append('image', file);
      axios.post(
        constants.UPLOAD_IMAGE_API,
        formData,
        {
          headers: {
            authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
          },
        },
      ).then((res) => {
        window.localStorage.setItem('JWT', res.data.data);
        navigate(0);
      }).catch((err) => {
        console.log(err);
      });
    }
    setFile(null);
    handleClose();
  };

  const handleCategory = (prop) => () => {
    if (prop !== category) {
      setAssets(null);
      setCategory(prop);
    }
  };

  const applyFriend = () => {
    axios.post(constants.APPLY_FRIEND_API, { id: user.id }, {
      headers: { authorization: token },
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem('JWT', res.data.data);
        setIsApply(!isApply);
      }).catch((err) => {
        console.log(err);
      });
  };

  const cancelApply = () => {
    axios.put(constants.CANCEL_APPLY_API, { id: user.id, action: 'cancel' }, {
      headers: { authorization: token },
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem('JWT', res.data.data);
        setIsApply(!isApply);
      }).catch((err) => {
        console.log(err);
      });
  };

  function getProfile(callback) {
    axios.get(constants.USER_PAGE_API, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      console.log(res);
      callback(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  function getUserProfile() {
    axios.post(constants.USER_PAGE_API, { id: params.id }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      console.log(res);
      setUser(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  function followUser() {
    axios.post(
      constants.FOLLOW_USER_API,
      { id: user.id },
      { headers: { authorization: token } },
    ).then((res) => {
      console.log(res);
      window.localStorage.setItem('JWT', res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  function unFollowUser() {
    axios.delete(constants.FOLLOW_USER_API, {
      headers: { authorization: token },
      data: { id: user.id },
    }).then((res) => {
      console.log(res);
      window.localStorage.setItem('JWT', res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleFollow = () => {
    setIsFollow(!isFollow);
    if (!isFollow) {
      followUser();
    } else {
      unFollowUser();
    }
  };

  useEffect(() => {
    if (token && userData && user) {
      if (userData.friends.includes(user.id)) {
        setIsFriend(true);
      }
      if (userData.apply_friends.includes(user.id)) {
        setIsApply(true);
      }
      if (userData.follows.includes(user.id)) {
        setIsFollow(true);
      }
    }
  }, [isApply, userData, user]);

  useEffect(() => {
    if (window.location.pathname === '/user/profile') {
      getProfile(setUser);
      setIsOwn(true);
    } else {
      getUserProfile();
      getProfile(setUserData);
    }
  }, [params]);

  useEffect(() => {
    if (userData) {
      if (userData.id === user.id) {
        setIsOwn(true);
      }
    }
  }, [user, userData]);

  useEffect(() => {
    let url;
    if (user) {
      setIsFetching(true);
      switch (category) {
        case 'post':
          url = constants.GET_USER_POST_API;
          break;
        case 'live':
          url = constants.GET_USER_LIVE_API;
          break;
        case 'follow':
          url = constants.GET_USER_FOLLOW_POST_API;
          break;
        case 'like':
          url = constants.GET_USER_LIKE_API;
          break;

        default:
          break;
      }
      axios.post(url, { id: user.id })
        .then((res) => {
          setAssets(res.data.data.reverse());
          setIsFetching(false);
        }).catch((err) => {
          console.log(err);
          setIsFetching(false);
        });
    }
  }, [user, category]);
  return (
    <>
      <Header />
      <div id="user-profile-container">
        { user
          ? (
            <>
              <div className="user-profile-header">
                <div id="user-profile-background-container">
                  {!isOwn && (
                  <div id="user-profile-social-btns">
                    {!isFriend && (
                    <div>
                      { isApply ? (
                        <Button
                          className="add-user-btn"
                          variant="outlined"
                          color="error"
                          type="button"
                          onClick={cancelApply}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          className="add-user-btn"
                          variant="contained"
                          type="button"
                          onClick={applyFriend}
                        >
                          Add friend
                        </Button>
                      )}
                    </div>
                    )}
                    {token && (
                    <Button
                      className="follow-user-btn"
                      variant={isFollow ? 'outlined' : 'contained'}
                      type="button"
                      onClick={handleFollow}
                    >
                      {isFollow ? 'Following' : 'Follow'}
                    </Button>
                    )}
                  </div>
                  )}
                  <img
                    id="user-profile-background"
                    src={user.background_image
                      ? `${constants.IMAGE_URL}/${user.background_image}` : '/profile-background.jpg'}
                    alt="background"
                  />
                  {isOwn
                    && (
                    <>
                      <IconButton
                        id="profile-background-edit-icon"
                        aria-label="upload picture"
                        component="label"
                        onClick={handleOpenBackground}
                        value="background"
                      >
                        <EditIcon />
                      </IconButton>
                      <UploadModal
                        open={openBackground}
                        file={file}
                        upload={uploadBackground}
                        handleClose={handleClose}
                        handleUpload={handleUpload}
                      />
                    </>
                    )}
                </div>

                <div id="user-profile-infos">
                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('post')}
                    id={category === 'post' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.posts.length}
                    </p>
                    <p className="user-profile-info-text">
                      Post
                    </p>
                  </button>

                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('live')}
                    id={category === 'live' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.lives.length}
                    </p>
                    <p className="user-profile-info-text">
                      Live
                    </p>
                  </button>

                  <div id="user-profile-avatar">
                    <Avatar
                      src={user.photo ? `${constants.IMAGE_URL}/${user.photo}` : null}
                      sx={{ width: 150, height: 150 }}
                    />
                    <p id="user-profile-name">{user.name}</p>
                    {isOwn
                    && (
                      <>
                        <IconButton
                          id="profile-avatar-edit-icon"
                          aria-label="upload picture"
                          component="label"
                          onClick={handleOpenAvatar}
                          value="avatar"
                        >
                          <EditIcon />
                        </IconButton>
                        <UploadModal
                          open={openAvatar}
                          file={file}
                          upload={uploadAvatar}
                          handleClose={handleClose}
                          handleUpload={handleUpload}
                        />
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('follow')}
                    id={category === 'follow' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.follow_posts.length}
                    </p>
                    <p className="user-profile-info-text">
                      Follow Post
                    </p>
                  </button>

                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('like')}
                    id={category === 'like' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.like_posts.length}
                    </p>
                    <p className="user-profile-info-text">
                      Like Post
                    </p>
                  </button>

                </div>
              </div>

              <div className="user-profile-assets-container">
                {isFetching ? (
                  <Box sx={{ display: 'flex', marginLeft: '49%' }}>
                    <CircularProgress size={30} color="inherit" />
                  </Box>
                ) : (
                  <>
                    {category === 'post' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.map((post) => (
                          <PostList
                            key={post._id}
                            post={post}
                          />
                        )) : null}
                      </div>
                    ) : null}

                    {category === 'live' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.map((live) => (
                          <UserLiveItem
                            live={live}
                            key={live._id}
                          />
                        )) : null}
                      </div>
                    ) : null}

                    {category === 'follow' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.map((post) => (
                          <PostList
                            key={post._id}
                            post={post}
                          />
                        )) : null}
                      </div>
                    ) : null}

                    {category === 'like' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.map((post) => (
                          <PostList
                            key={post._id}
                            post={post}
                          />
                        )) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </>
          )
          : null}
      </div>
      <Footer />
    </>
  );
}

export default Profile;
