import React, { useState } from "react";
import "./Header.css";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">📍</span>
          <span className="logo-text">localists</span>
        </div>

        {/* Desktop Menu */}
        <nav className="nav">
          <div className="nav-item">Explore Our Services ▾</div>
          <div className="nav-item">Advice ▾</div>
        </nav>
      </div>

      {/* Right Section */}
      <div className="header-right">
        <div className="search-box">
          <input type="text" placeholder="Search for a service" />
          <span className="search-icon">🔍</span>
        </div>

        <button className="login-btn">Login</button>
        <button className="signup-btn">
          <PersonAddOutlinedIcon fontSize="small" />
          <span>Sign Up</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-item">Explore Our Services</div>
          <div className="mobile-item">Advice</div>
          <div className="mobile-item">Login</div>
          <div className="mobile-item signup">Sign Up</div>
        </div>
      )}
    </header>
  );
};

export default Header;
