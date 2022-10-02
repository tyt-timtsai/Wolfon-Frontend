import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from '../../components/login/signup';
import SignIn from '../../components/login/signin';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignIn = () => {
    setIsSignIn(true);
  };

  const handleSignUp = () => {
    setIsSignIn(false);
  };

  useEffect(() => {
    const jwt = window.localStorage.getItem('JWT');
    if (jwt) {
      navigate('/user/profile');
    }
  }, []);
  return (
    <>
      <Header />
      <div id="login-container">
        <div id="login-btns">
          <button
            type="button"
            style={
            isSignIn ? {
              backgroundColor: 'var(--main-color)',
              color: 'var(--main-bg-color)',
            } : null
          }
            onClick={handleSignIn}
          >
            Sign in

          </button>
          <button
            type="button"
            style={
            isSignIn ? null : {
              backgroundColor: 'var(--main-color)',
              color: 'var(--main-bg-color)',
            }
          }
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
        <div className="login-form-container" style={isSignIn ? { display: 'flex' } : { display: 'none' }}>
          <SignIn />
        </div>
        <div className="login-form-container" style={isSignIn ? { display: 'none' } : { display: 'flex' }}>
          <SignUp />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
