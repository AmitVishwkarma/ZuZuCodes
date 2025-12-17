import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-left">
          <div className="rating-badge">
            <span className="rating-text">Excellent</span>
            <span className="stars">★★★★★</span>
            <span className="trustpilot">Trustpilot</span> 
          </div>

          <h1 className="hero-title">
            Find Local <br />
            Services. <br />
            <span>Fast.</span>
          </h1>

          <p className="hero-subtitle">
            Get instant quotes from local professionals.
          </p>

          <div className="hero-search">
            <input
              type="text"
              placeholder="Search for a service"
            />
            <button>🔍</button>
          </div>
        </div>

        {/* Right Content */}
        <div className="hero-right">
          <p className="popular-title">Popular Services:</p>

          <div className="tags">
            <span>Landscapers</span>
            <span>Patio Layers</span>
            <span>Private Tutors</span>
            <span>Fence & Gate Installers</span>
            <span>Personal Trainers</span>
            <span>Tree Surgeons</span>
            <span>Architects</span>
            <span>Painter Decorators</span>
            <span>Airport Transfers</span>
            <span>Physics and Maths Tutors</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
