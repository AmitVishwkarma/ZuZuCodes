import React from "react";
import "./Card.css";

const Card = () => {
  return (
    <section className="how-it-works">
      <h2 className="section-title">
        <span>How it</span> works.
      </h2>

      <div className="card-wrapper">
        <div className="work-card">
          <div className="icon">
            📄✏️
          </div>
          <h3>Fill in your details for your project</h3>
        </div>

        <div className="work-card">
          <div className="icon">
            👤👤
          </div>
          <h3>Receive quotes from Professionals</h3>
        </div>

        <div className="work-card">
          <div className="icon">
            📄🔍
          </div>
          <h3>Compare your quotes and enjoy great savings</h3>
        </div>
      </div>

      <button className="get-started-btn">Get Started</button>
    </section>
  );
};

export default Card;
