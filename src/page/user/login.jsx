import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from '../../components/login/signup';
import SignIn from '../../components/login/signin';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import './login.css';

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const jwt = window.localStorage.getItem('JWT');
    if (jwt) {
      navigate('/user/profile');
    }
  }, []);
  return (
    <div id="login-container">
      <Header />
      <div id="login-form-container">
        <SignIn />
        <SignUp />
      </div>
      <Footer />
    </div>
  );
}

export default Login;
