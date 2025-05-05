<<<<<<< HEAD
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
          <div className="logo">Iwe</div>
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
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <div className="nav-container">
          <div className="logo">Iwe</div>
          <div className="nav-items">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="nav-item">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

=======
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
          <div className="logo">Iwe</div>
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
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <div className="nav-container">
          <div className="logo">Iwe</div>
          <div className="nav-items">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="nav-item">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

>>>>>>> 45d090d0dae1ede3f649e76f90a1db8867123bc7
export default Header;