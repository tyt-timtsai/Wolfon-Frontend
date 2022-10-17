/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Checkbox, Paper,
  IconButton,
} from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import parser from 'html-react-parser';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../components/header/header';
import UserInfo from '../../components/sidebar/userInfo';
import Footer from '../../components/footer/footer';
import constants from '../../global/constants';
import './post.css';

function Post() {
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState('');
  const [author, setAuthor] = useState('');
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState();
  const [follow, setFollow] = useState(false);
  const [followers, setFollowers] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  async function likePost() {
    axios.get(`${constants.LIKE_POST_API}/${post._id}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        window.localStorage.setItem('JWT', res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function followPost() {
    axios.get(`${constants.FOLLOW_POST_API}/${post._id}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        window.localStorage.setItem('JWT', res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deletePost() {
    axios.delete(`${constants.DELETE_POST_API}/${post._id}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        window.localStorage.setItem('JWT', res.data.data);
        navigate('/user/profile');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Yes, Delete it',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost();
      }
    });
  };

  const handleEdit = () => {
    navigate(`/post/edit/${post._id}`);
  };

  const handleChange = (prop) => async () => {
    if (!window.localStorage.getItem('JWT')) {
      return Swal.fire({
        title: 'Error!',
        text: '尚未登入',
        icon: 'error',
        confirmButtonText: '前往登入',
        denyButtonText: '繼續瀏覽',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/user/login');
        }
      });
    }
    switch (prop) {
      case 'like':
        await likePost();
        setLike(!like);
        if (like) {
          setLikes(likes - 1);
        } else {
          setLikes(likes + 1);
        }
        break;

      case 'follow':
        await followPost();
        setFollow(!follow);
        if (follow) {
          setFollowers(followers - 1);
        } else {
          setFollowers(followers + 1);
        }
        break;
      default:
        break;
    }

    return 0;
  };

  async function getPost() {
    const result = await axios.get(`${constants.GET_POST_API}${location.pathname}`);
    const postData = result.data.data;
    setPost(postData.post);
    setAuthor(postData.userData);
    setLikes(postData.post.likes.length);
    setFollowers(postData.post.followers.length);
    return postData;
  }

  async function getUser(token) {
    try {
      const result = await axios.get(constants.PROFILE_API, {
        headers: {
          authorization: token,
        },
      });
      const user = result.data.data;
      return user;
    } catch (err) {
      if (err.response.status === 403 || err.response.status === 400) {
        window.localStorage.removeItem('JWT');
        navigate('/user/login');
      }
    }
    return 1;
  }

  async function initPost() {
    let postData;
    const token = window.localStorage.getItem('JWT');
    try {
      postData = await getPost();
      if (token) {
        const user = await getUser(token);
        const userId = user._id;
        setLike(postData.post.likes.includes(userId));
        setFollow(postData.post.followers.includes(userId));
        setIsLogin(true);
        if (userId === postData.userData._id) {
          setIsAuthor(true);
        }
      }
    } catch (error) {
      console.log(error);
      if (!postData) {
        Swal.fire({
          title: 'Error!',
          text: '無此文章',
          icon: 'error',
          confirmButtonText: '回上一頁',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(-1);
          }
        });
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    initPost();
  }, []);

  return (
    <>
      <Header />
      <div id="post-detail-container">
        {post ? (
          <>
            {isLogin && !isAuthor ? (
              <div id="post-details">
                <div className="post-detail-icons">
                  <Checkbox
                    icon={<FavoriteBorder sx={{ color: '#fff' }} />}
                    checked={like}
                    checkedIcon={<Favorite sx={{ color: '#F50057' }} />}
                    onChange={handleChange('like')}
                  />
                  <p className="post-like-and-follow">
                    {likes}
                  </p>
                </div>
                <div className="post-detail-icons">
                  <Checkbox
                    icon={<BookmarkBorderIcon sx={{ color: '#fff' }} />}
                    checked={follow}
                    checkedIcon={<BookmarkIcon />}
                    onChange={handleChange('follow')}
                  />
                  <p className="post-like-and-follow">
                    {followers}
                  </p>
                </div>
              </div>
            ) : null}

            <Paper elevation={6} id="post-detail-content">
              <div id="post-detail-content-header">
                <h1>{post.title}</h1>
                <h3>{post.subtitle}</h3>
                <p id="post-published">
                  Published :
                  {' '}
                  {post.created_dt.slice(0, -4)}
                </p>
                {isAuthor
                && (
                <>
                  <IconButton
                    id="post-edit-btn"
                    aria-label="edit post"
                    component="label"
                    onClick={handleEdit}
                  >
                    <EditIcon style={{ color: 'black' }} />
                  </IconButton>
                  <IconButton
                    id="post-delete-btn"
                    aria-label="delete post"
                    component="label"
                    onClick={handleDelete}
                  >
                    <DeleteIcon style={{ color: 'var(--main-record-color)' }} />
                  </IconButton>
                </>
                )}
              </div>

              <hr style={{ width: '95%', border: '1px solid var(--third-color)' }} />

              <div className="ProseMirror">
                {parser(post.content)}
              </div>

            </Paper>

            <UserInfo
              userData={author}
              isPost
            />
          </>
        ) : <p> Loading... </p>}
      </div>
      <Footer />
    </>
  );
}

export default Post;
