import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p> @ copyright iwe.com {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;

// @ copyright iwe.com 2025. All Rights Reserved