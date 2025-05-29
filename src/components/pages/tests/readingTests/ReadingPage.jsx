import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./reading.css";



const ReadingPage = () => {  // `BeginnerTest` emas, `ReadingPage` bo‘lishi kerak
  const navigate = useNavigate();

  return (
    <div className="reading-page">
      <motion.div
        className="reading-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="reading-title">Select Your Reading Level</h1>
        <p className="reading-description">
          Choose a level and start practicing your reading skills!
        </p>
        <div className="test-list">
          <Link to="/reading/beginner" className="test-item beginner">
            Beginner
          </Link>
          <Link to="/reading/intermediate" className="test-item intermediate">
            Intermediate
          </Link>
          <Link to="/reading/advanced" className="test-item advanced">
            Advanced
          </Link>
        </div>
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </motion.div>
    </div>
  );
};

export default ReadingPage;
