import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./reading.css";

const BeginnerTest = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [tests, setTests] = useState([]);
  const [userId] = useState(localStorage.getItem("userId"));
  const [userEmail] = useState(localStorage.getItem("userEmail"));

  // Fetch Beginner level tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://192.168.1.11:5050/api/readingTest/all");
        const data = await response.json();
        const beginnerTests = data.data.filter((test) => test.level === "Beginner");
        setTests(beginnerTests);
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

  // Send results to the backend
  useEffect(() => {
    if (showResult && userId && userEmail) {
      const updateReadingTest = async () => {
        try {
          const requestData = {
            email: userEmail,  // or userId
            "tests.readingTest": {
              totalScore: score,
              correctAnswers: score,
              incorrectAnswers: tests.length - score,
              testHistory: [{
                score: score,
                date: new Date(),
                answers: tests.map((test, idx) => ({
                  question: test.question,
                  correctAnswer: test.answer,
                  userAnswer: selectedAnswer,
                  isCorrect: test.answer === selectedAnswer,
                }))
              }]
            }
          };

          const res = await fetch("http://192.168.1.11:5050/api/auth/update-reading-test", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });

          if (!res.ok) {
            throw new Error("Foydalanuvchi test natijalarini yangilashda xatolik.");
          }

          console.log("Test natijalari muvaffaqiyatli yangilandi!");
        } catch (error) {
          console.error("Saqlashda xatolik:", error);
          alert("Test natijalarini saqlashda xatolik yuz berdi.");
        }
      };

      updateReadingTest();
    }
  }, [showResult, score, userId, userEmail, tests, selectedAnswer]);

  return (
    <div className="reading-test-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* START */}
      {!showTest ? (
        <div className="reading-container">
          <h2 className="reading-title">Beginner Level Reading</h2>
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
          <h2 className="test-title">Beginner Level Reading Test</h2>
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
        </div>
      )}
    </div>
  );
};

export default BeginnerTest;
