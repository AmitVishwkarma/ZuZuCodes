import React, { useState } from "react";
import "./Slider.css";
import image1 from "../assets/img/1.jpg";
import image2 from "../assets/img/2.jpg";
import image3 from "../assets/img/3.jpg";
import image4 from "../assets/img/4.jpg";

const jobs = [
  {
    title: "Tree Surgeon",
    image: image1,
  },
  {
    title: "Landscaper",
    image: image2,
  },
  {
    title: "Personal Trainer",
    image: image3,
  },
  {
    title: "Driveways",
    image: image4,
  },
];

const Slider = () => {
  const [active, setActive] = useState(0);

  const next = () =>
    setActive((prev) => (prev + 1) % jobs.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + jobs.length) % jobs.length);

  return (
    <section className="popular">
      <div className="popular-header">
        <h2>
          <span>Popular</span> jobs.
        </h2>

        <div className="nav-buttons">
          <button onClick={prev}>‹</button>
          <button onClick={next}>›</button>
        </div>
      </div>

      <div className="cards-wrapper">
        {jobs.map((job, index) => (
          <div
            className={`job-card ${
              index === active ? "active" : ""
            }`}
            key={index}
          >
            <div className="card-title">{job.title}</div>

            <div className="image-box">
              <img src={job.image} alt={job.title} />
              <button className="explore-btn">Explore</button>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {jobs.map((_, i) => (
          <span
            key={i}
            className={i === active ? "active" : ""}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Slider;
