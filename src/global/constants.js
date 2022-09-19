const SERVER_URL = 'http://localhost:3000';
const SOCKET_URL = 'ws://localhost:3000';
const API_URL = 'http://localhost:3000/api/v1';
const WEB_URL = 'http://localhost:3001';

// const SERVER_URL = 'http://wolfon.live';
// const SOCKET_URL = 'wss://wolfon.live';
// const API_URL = 'https://wolfon.live/api/v1';

const UPLOAD_SIZE = 1024 * 1024 * 10;

// User API
const PROFILE_API = `${API_URL}/user`;
const SIGNUP_API = `${API_URL}/user/signup`;
const SIGNIN_API = `${API_URL}/user/signin`;
const GET_USER_LIVE_API = `${API_URL}/user/live`;
const GET_USER_POST_API = `${API_URL}/user/post`;
const GET_USER_FRIEND_API = `${API_URL}/user/friend`;
const GET_USER_COMMUNITY_API = `${API_URL}/user/community`;

// Live API
const GET_LIVE_API = `${API_URL}/live`;
const CREATE_LIVE_API = `${API_URL}/live`;
const SEARCH_LIVE_API = `${API_URL}/live/search`;
const UPLOAD_LIVE_API = `${API_URL}/live/upload`;
const COMPLETE_UPLOAD_LIVE_API = `${API_URL}/live/complete`;

// Code API
const GET_CODE_API = `${API_URL}/code`;
const GET_VERSION_API = `${API_URL}/code`;

// Post API
const GET_ALL_POST_API = `${API_URL}/post/all`;
const CREATE_POST_API = `${API_URL}/post`;
const LIKE_POST_API = `${API_URL}/post/like`;
const FELLOW_POST_API = `${API_URL}/post/fellow`;

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  // CONSTANTS
  SERVER_URL,
  SOCKET_URL,
  WEB_URL,
  UPLOAD_SIZE,
  // USER
  SIGNUP_API,
  SIGNIN_API,
  PROFILE_API,
  GET_USER_LIVE_API,
  GET_USER_POST_API,
  GET_USER_FRIEND_API,
  GET_USER_COMMUNITY_API,
  // LIVE
  GET_LIVE_API,
  CREATE_LIVE_API,
  SEARCH_LIVE_API,
  UPLOAD_LIVE_API,
  COMPLETE_UPLOAD_LIVE_API,
  // CODE
  GET_CODE_API,
  GET_VERSION_API,
  // POST
  GET_ALL_POST_API,
  CREATE_POST_API,
  LIKE_POST_API,
  FELLOW_POST_API,
};
