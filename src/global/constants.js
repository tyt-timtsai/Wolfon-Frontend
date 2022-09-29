const IMAGE_URL = 'https://s3.ap-northeast-1.amazonaws.com/wolfon';
const WEB_URL = 'http://localhost:3001';

const SERVER_URL = 'http://localhost:3000';
const SOCKET_URL = 'ws://localhost:3000';
const API_URL = 'http://localhost:3000/api/v1';

// const SERVER_URL = 'https://www.wolfon.live';
// const SOCKET_URL = 'wss://www.wolfon.live';
// const API_URL = 'https://www.wolfon.live/api/v1';

const UPLOAD_SIZE = 1024 * 1024 * 10;

// User API
const PROFILE_API = `${API_URL}/user`;
const USER_PAGE_API = `${API_URL}/user`;
const SIGNUP_API = `${API_URL}/user/signup`;
const SIGNIN_API = `${API_URL}/user/signin`;
// Asset
const GET_USER_LIVE_API = `${API_URL}/user/live`;
const GET_USER_POST_API = `${API_URL}/user/post`;
const GET_USER_LIKE_API = `${API_URL}/user/like`;
const GET_USER_FOLLOW_POST_API = `${API_URL}/user/follow_post`;
const GET_USER_FRIEND_API = `${API_URL}/user/friend`;
const GET_USER_FOLLOWER_API = `${API_URL}/user/follower`;
const GET_USER_COMMUNITY_API = `${API_URL}/user/community`;
// Setting
const UPLOAD_IMAGE_API = `${API_URL}/user/image`;
// Friends
const APPLY_FRIEND_API = `${API_URL}/user/friend`;
const CANCEL_APPLY_API = `${API_URL}/user/friend`;
const ACCEPT_APPLY_API = `${API_URL}/user/friend`;
const DELETE_FRIEND_API = `${API_URL}/user/friend`;
// Follow User
const FOLLOW_USER_API = `${API_URL}/user/follow`;

// Live API
const GET_LIVE_API = `${API_URL}/live`;
const CREATE_LIVE_API = `${API_URL}/live`;
const SEARCH_LIVE_API = `${API_URL}/live/search`;
const UPLOAD_SCEEENSHOT_API = `${API_URL}/live/screenshot`;
const UPLOAD_LIVE_API = `${API_URL}/live/upload`;
const COMPLETE_UPLOAD_LIVE_API = `${API_URL}/live/complete`;

// Code API
const GET_CODE_API = `${API_URL}/code`;
const GET_VERSION_API = `${API_URL}/code`;

// Post API
const GET_POST_API = `${API_URL}`;
const GET_ALL_POST_API = `${API_URL}/post/all`;
const CREATE_POST_API = `${API_URL}/post`;
const LIKE_POST_API = `${API_URL}/post/like`;
const FOLLOW_POST_API = `${API_URL}/post/follow`;

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  // CONSTANTS
  SERVER_URL,
  SOCKET_URL,
  WEB_URL,
  IMAGE_URL,
  UPLOAD_SIZE,
  // USER
  SIGNUP_API,
  SIGNIN_API,
  PROFILE_API,
  USER_PAGE_API,
  GET_USER_LIVE_API,
  GET_USER_POST_API,
  GET_USER_LIKE_API,
  GET_USER_FRIEND_API,
  GET_USER_FOLLOWER_API,
  GET_USER_COMMUNITY_API,
  GET_USER_FOLLOW_POST_API,
  APPLY_FRIEND_API,
  CANCEL_APPLY_API,
  ACCEPT_APPLY_API,
  DELETE_FRIEND_API,
  FOLLOW_USER_API,
  UPLOAD_IMAGE_API,
  // LIVE
  GET_LIVE_API,
  CREATE_LIVE_API,
  SEARCH_LIVE_API,
  UPLOAD_LIVE_API,
  UPLOAD_SCEEENSHOT_API,
  COMPLETE_UPLOAD_LIVE_API,
  // CODE
  GET_CODE_API,
  GET_VERSION_API,
  // POST
  GET_POST_API,
  GET_ALL_POST_API,
  CREATE_POST_API,
  LIKE_POST_API,
  FOLLOW_POST_API,
};
