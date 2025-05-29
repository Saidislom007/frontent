import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../tests/readingTests/reading.css";
import { advancedTests } from "../tests/readingTests/readingData.js";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";


const AdvancedReadingTest = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const userId = localStorage.getItem("userId");; // Foydalanuvchi ID sini backenddan yoki localStorage dan olish kerak

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === advancedTests[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion + 1 < advancedTests.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
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

  // Test tugaganda natijani backendga yuborish
  useEffect(() => {
    if (showResult) {
      const bandScore = calculateBandScore(score);
      const updateReadingSkill = async () => {
        try {
          const response = await fetch(`http://192.168.1.11:5050/api/auth/update-skill/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reading: score }),
          });

          if (response.ok) {
            console.log("Reading skill updated successfully");
          } else {
            console.error("Failed to update reading skill");
          }
        } catch (error) {
          console.error("Error updating reading skill:", error);
        }
      };

      updateReadingSkill();
    }
  }, [showResult, score, userId]);

  return (
    <div className="reading-test-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {!showTest ? (
         
        <div className="reading-container">
          <h2 className="reading-title">Advanced Level Listening</h2>

          <button className="start-test-btn" onClick={() => setShowTest(true)}>Start Test</button>
        </div>
      ) : !showResult ? (
        <div className="test-container">
          <h2 className="test-title">Advanced Level Listening Test</h2>
          <AudioPlayer src="/Exercise.mp3" onPlay={() => console.log("Playing...")} />
          <h3 className="question">{advancedTests[currentQuestion].question}</h3>
          <div className="options">
            {advancedTests[currentQuestion].options.map((option, index) => (
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
            {currentQuestion + 1 < advancedTests.length ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div className="result-container">
          <h2 className="result-title">Test Completed!</h2>
          <p className="score-text">Your Score: {score} / {advancedTests.length}</p>
          <h3 className="result-message">
            {score >= 7 ? "Malades! 🎉" : score >= 4 ? "Yaxshi o‘qi! 📚" : "Ko‘proq mashq qil! 🔄"}
          </h3>
          <h3 className="result-message">IELTS Band Score: {calculateBandScore(score)}</h3>
        </div>
      )}
    </div>
  );
};

export default AdvancedReadingTest;
