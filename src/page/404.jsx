import React from 'react';
import Header from '../components/header/header';
import Wolf from '../components/wolf/wolf';
import Footer from '../components/footer/footer';
import './404.css';

function NotFoundPage() {
  return (
    <>
      <Header />
      <div id="not-found-container">
        <h1 id="not-found-h1"> 404 Not Found </h1>
        <Wolf />
      </div>
      <Footer />
    </>
  );
}

export default NotFoundPage;
