const SERVER_URL = 'http://localhost:3000';
const SOCKET_URL = 'ws://localhost:3000';

const API_URL = 'http://localhost:3000/api/v1';

const UPLOAD_SIZE = 1024 * 1024 * 10;

// User API
const PROFILE_API = `${API_URL}/user`;

// Live API
const GET_LIVE_API = `${API_URL}/live`;
const CREATE_LIVE_API = `${API_URL}/live`;
const SEARCH_LIVE_API = `${API_URL}/live/search`;
const UPLOAD_LIVE_API = `${API_URL}/live/upload`;
const COMPLETE_UPLOAD_LIVE_API = `${API_URL}/live/complete`;

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  SERVER_URL,
  SOCKET_URL,
  UPLOAD_SIZE,
  PROFILE_API,
  GET_LIVE_API,
  CREATE_LIVE_API,
  SEARCH_LIVE_API,
  UPLOAD_LIVE_API,
  COMPLETE_UPLOAD_LIVE_API,
};
