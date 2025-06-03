import React, { useState } from "react";
import { Menu, X } from 'lucide-react';
import "./Header.css"; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { label: 'Home', href: './' },
    { label: 'About', href: './About' },
    // { label: 'Services', href: '#section-three' },
    // { label: 'Contact', href: '#section-seven' }
  ];

  // Mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-container">
          <div className="logo">
          <img
              src="\assets\Iwe_logo-removebg-preview.png"
              alt="logo"
            />
          </div>
          <button 
            className="hamburger-menu" 
            onClick={toggleMenu}
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className="mobile-menu-item"
                onClick={toggleMenu}
              >
                {item.label}
              </a>
            ))}
               <a 
              href="./updated-auth.html" 
              className="mobile-menu-item mobile-join1-button"
            >
              Join Us Today
            </a>
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <div className="nav-container">
          <div className="logo">
          <img
              src="\assets\Iwe_logo-removebg-preview.png"
              alt="logo"
            />
          </div>
          <div className="nav-items">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="nav-item">
                {item.label}
              </a>
            ))}

<a 
              href="./auth.html"
              target="_blank" 
              className="nav-item join1-us-button"
            >
              Join Us Today
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;