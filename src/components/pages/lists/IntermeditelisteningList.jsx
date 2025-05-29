import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { intermediateTests } from "../tests/readingTests/readingData.js";

const IntermediateListeningList = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === intermediateTests[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion + 1 < intermediateTests.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null); // Tanlangan javobni tozalash
    } else {
      setShowResult(true);
    }
  };
  const calculateBandScore = (rawScore) => {
    if (rawScore <= 2) return 3.0;
    if (rawScore === 3) return 4.0;
    if (rawScore === 4) return 5.0;
    if (rawScore === 5) return 6.0;
    if (rawScore === 6) return 6.5;
    if (rawScore === 7) return 7.0;
    if (rawScore === 8) return 7.5;
    return 8.0;
  }; 

  useEffect(() => {
    if (showResult) {
      const bandScore = calculateBandScore(score);
      const updateListeningSkill = async () => {
        try {
          const response = await fetch(`http://192.168.1.11:5050/api/auth/update-skill/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ listening: score }),
          });

          if (response.ok) {
            console.log("Listening skill updated successfully");
          } else {
            console.error("Failed to update listening skill");
          }
        } catch (error) {
          console.error("Error updating listening skill:", error);
        }
      };

      updateListeningSkill();
    }
  }, [showResult, score, userId]);

  return (
    <div className="listening-test-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {!showTest ? (
        <div className="listening-container">
          <h2 className="listening-title">Intermediate Level Listening</h2>
          <button className="start-test-btn" onClick={() => setShowTest(true)}>Start Test</button>
        </div>
      ) : !showResult ? (
        <div className="test-container">
          <h2 className="test-title">Intermediate Level Listening Test</h2>
          <AudioPlayer src={intermediateTests[currentQuestion].audioSrc} controls />
          <h3 className="question">{intermediateTests[currentQuestion].question}</h3>
          <div className="options">
            {intermediateTests[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
                onClick={() => handleAnswerClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="next-btn" onClick={handleNextQuestion}>
            {currentQuestion + 1 < intermediateTests.length ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div className="result-container">
          <h2 className="result-title">Test Completed!</h2>
          <p className="score-text">Your Score: {score} / {intermediateTests.length}</p>
          <h3 className="result-message">
            {score >= 7 ? "Excellent! 🎉" : score >= 4 ? "Keep practicing! 🎧" : "Listen more carefully! 🔄"}
          </h3>
          <h3 className="result-message">IELTS Band Score: {calculateBandScore(score)}</h3>
        </div>
      )}
    </div>
  );
};

export default IntermediateListeningList;
