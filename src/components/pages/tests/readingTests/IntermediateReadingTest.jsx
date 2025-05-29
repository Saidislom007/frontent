import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./reading.css";

const IntermediateTest = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [tests, setTests] = useState([]);

  // Fetch Beginner level tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://192.168.1.11:5050/api/readingTest/all");
        const data = await response.json();
        const intermediteTests = data.data.filter((test) => test.level === "Intermediate");
        setTests(intermediteTests);
      } catch (error) {
        console.error("Testlarni olishda xatolik:", error);
      }
    };

    fetchTests();
  }, []);

  // Answer click
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  // Next question
  const handleNextQuestion = () => {
    if (selectedAnswer === tests[currentQuestion]?.answer) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestion + 1 < tests.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  // Band score calculation
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

  // Save the result after test finished
  useEffect(() => {
    if (showResult && userId) {
      const bandScore = calculateBandScore(score);

      const updateResults = async () => {
        try {
          const requestData = {
            user: userId,
            score: {
              reading: bandScore,
              listening: 0,
              writing: 0,
              speaking: 0,
            },
            totalScore: bandScore,
          };

          // 1. Create stat
          const statRes = await fetch("http://192.168.1.11:5050/api/stat/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });

          if (!statRes.ok) {
            throw new Error("Stat yaratishda xatolik.");
          }

          // 2. Update user skill
          const skillRes = await fetch(`http://192.168.1.11:5050/api/auth/update-skill/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reading: bandScore }),
          });

          if (!skillRes.ok) {
            throw new Error("Foydalanuvchi reading skillini yangilashda xatolik.");
          }

          console.log("Stat va skill muvaffaqiyatli saqlandi!");
        } catch (error) {
          console.error("Saqlashda xatolik:", error);
          alert("Natijalarni saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
        }
      };

      updateResults();
    }
  }, [showResult, score, userId]);

  return (
    <div className="reading-test-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* START */}
      {!showTest ? (
        <div className="reading-container">
          <h2 className="reading-title">Intermediate Level Reading</h2>
          {tests.map((test, index) => (
            <p key={index} className="reading-text">{test.passage}</p>
          ))}
          <button className="start-test-btn" onClick={() => setShowTest(true)}>
            Start Test
          </button>
        </div>
      ) : 
      
      // TEST
      !showResult ? (
        <div className="test-container">
          <h2 className="test-title">Intermediate Level Reading Test</h2>
          {tests.length > 0 && (
            <>
              <h3 className="question">{tests[currentQuestion]?.question}</h3>
              <div className="options">
                {tests[currentQuestion]?.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
                    onClick={() => handleAnswerClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button className="next-btn" onClick={handleNextQuestion}>
                {currentQuestion + 1 < tests.length ? "Next" : "Finish"}
              </button>
            </>
          )}
        </div>
      ) : 
      
      // RESULT
      (
        <div className="result-container">
          <h2 className="result-title">Test Completed!</h2>
          <p className="score-text">Your Score: {score} / {tests.length}</p>
          <h3 className="result-message">
            IELTS Band Score: {calculateBandScore(score)}
          </h3>
        </div>
      )}
    </div>
  );
};

export default IntermediateTest;
