import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Swal from 'sweetalert2';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import constants from '../../global/constants';
import './signin.css';

function signIn() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: 'user01@gmail.com',
    password: '123456',
    showPassword: false,
  });

  const handleChange = (prop) => (e) => {
    setUserData({ ...userData, [prop]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setUserData({
      ...userData,
      showPassword: !userData.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const signin = () => {
    const dataArray = Object.values(userData);
    if (dataArray.some((value) => value === '')) {
      return Swal.fire({
        title: 'Error!',
        text: `缺少欄位 ： ${(Object.keys(userData)[dataArray.indexOf('')])}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    return (
      axios.post(constants.SIGNIN_API, { data: userData })
        .then((res) => {
          setUserData({
            email: userData.email,
            password: '',
            showPassword: false,
          });
          window.localStorage.setItem('JWT', res.data.data);
          navigate('/user/profile');
        })
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 403) {
            Swal.fire({
              title: 'Error!',
              text: '信箱或密碼錯誤',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
          if (err.response.status === 401) {
            Swal.fire({
              title: 'Error!',
              text: '信箱未註冊',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        })
    );
  };

  return (
    <div id="signin-container">
      <Paper elevation={6} id="signin-paper">
        <div id="signin-header">
          <img id="sign-logo" src="/wolf-emblem.png" alt="logo" />
        </div>
        <div id="signin-input-container">
          <TextField
            required
            id="signin-email"
            className="signin-inputs"
            label="Email"
            value={userData.email}
            onChange={handleChange('email')}
            variant="filled"
            margin="dense"
          />
          <FormControl required variant="filled" margin="dense">
            <InputLabel htmlFor="signin-password">Password</InputLabel>
            <FilledInput
              id="signin-password"
              className="signin-inputs"
              type={userData.showPassword ? 'text' : 'password'}
              value={userData.password}
              onChange={handleChange('password')}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {userData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            )}
            />
          </FormControl>
        </div>
        <Button id="signin-btn" onClick={signin}>Sign in</Button>
      </Paper>
    </div>
  );
}

export default signIn;
