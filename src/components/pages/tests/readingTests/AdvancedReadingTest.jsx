// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./reading.css";
// import { advancedTests } from "./readingData.js";

// const AdvancedReadingTest = () => {
//   const navigate = useNavigate();
//   const [showTest, setShowTest] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);

//   const userId = localStorage.getItem("userId");; // Foydalanuvchi ID sini backenddan yoki localStorage dan olish kerak

//   const handleAnswerClick = (answer) => {
//     setSelectedAnswer(answer);
//   };

//   const handleNextQuestion = () => {
//     if (selectedAnswer === advancedTests[currentQuestion].answer) {
//       setScore((prevScore) => prevScore + 1);
//     }

//     if (currentQuestion + 1 < advancedTests.length) {
//       setCurrentQuestion((prev) => prev + 1);
//       setSelectedAnswer(null);
//     } else {
//       setShowResult(true);
//     }
//   };
//   const calculateBandScore = (rawScore) => {
//     if (rawScore <= 2) return 3.0;
//     if (rawScore === 3) return 4.0;
//     if (rawScore === 4) return 5.0;
//     if (rawScore === 5) return 6.0;
//     if (rawScore === 6) return 6.5;
//     if (rawScore === 7) return 7.0;
//     if (rawScore === 8) return 7.5;
//     return 8.0;
//   }; 

//   // Test tugaganda natijani backendga yuborish
//   useEffect(() => {

//     if (showResult) {
//       const bandScore = calculateBandScore(score);
//       const updateReadingSkill = async () => {
//         try {
//           const response = await fetch(`http://192.168.1.11:5050/api/auth/update-skill/${userId}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ reading: score }),
//           });

//           if (response.ok) {
//             console.log("Reading skill updated successfully");
//           } else {
//             console.error("Failed to update reading skill");
//           }
//         } catch (error) {
//           console.error("Error updating reading skill:", error);
//         }
//       };

//       updateReadingSkill();
//     }
//   }, [showResult, score, userId]);

//   return (
//     <div className="reading-test-page">
//       <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
//       {!showTest ? (
//         <div className="reading-container">
//           <h2 className="reading-title">Advanced Level Reading</h2>
//           {advancedTests.map((test, index) => (
//             <p key={index} className="reading-text">{test.passage}</p>
//           ))}
//           <button className="start-test-btn" onClick={() => setShowTest(true)}>Start Test</button>
//         </div>
//       ) : !showResult ? (
//         <div className="test-container">
//           <h2 className="test-title">Advanced Level Reading Test</h2>
//           <h3 className="question">{advancedTests[currentQuestion].question}</h3>
//           <div className="options">

//             {advancedTests.map((test, index) => (
//                 <p key={index} className="reading-text">{test.passage}</p>
//           ))}
//               {advancedTests[currentQuestion].options.map((option, index) => (
//               <button
//                 key={index}
//                 className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
//                 onClick={() => handleAnswerClick(option)}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>

//           <button className="next-btn" onClick={handleNextQuestion}>
//             {currentQuestion + 1 < advancedTests.length ? "Next" : "Finish"}
//           </button>
//         </div>
//       ) : (
//         <div className="result-container">
//           <h2 className="result-title">Test Completed!</h2>
//           <p className="score-text">Your Score: {score} / {advancedTests.length}</p>
//           <h3 className="result-message">
//             {score >= 7 ? "Malades! 🎉" : score >= 4 ? "Yaxshi o‘qi! 📚" : "Ko‘proq mashq qil! 🔄"}
//             <h3 className="result-message">IELTS Band Score: {calculateBandScore(score)}</h3>
//           </h3>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdvancedReadingTest;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./reading.css";

const AdvancedReadingTest = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  // Fetch Advanced level tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://192.168.1.11:5050/api/readingTest/all");
        const data = await response.json();
        const advancedTests = data.data.filter((test) => test.level === "Advanced");
        setTests(advancedTests);
      } catch (error) {
        console.error("Testlarni olishda xatolik:", error);
        setError("Testlarni olishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
      } finally {
        setLoading(false);
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
    const correctAnswer = tests[currentQuestion]?.answer?.trim().toLowerCase();
    const userAnswer = selectedAnswer?.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
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

          const statRes = await fetch("http://192.168.1.11:5050/api/stat/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });

          if (!statRes.ok) {
            throw new Error("Stat yaratishda xatolik.");
          }

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

      {/* Loading */}
      {loading ? (
        <div className="loading">Yuklanmoqda...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : !showTest ? (
        <div className="reading-container">
          <h2 className="reading-title">Advanced Level Reading</h2>
          {tests.length > 0 ? (
            <>
              {tests.map((test, index) => (
                <p key={index} className="reading-text">{test.passage}</p>
              ))}
              <button className="start-test-btn" onClick={() => setShowTest(true)}>
                Start Test
              </button>
            </>
          ) : (
            <p className="no-tests">Hozircha Advanced level testlar mavjud emas.</p>
          )}
        </div>
      ) : !showResult ? (
        <div className="test-container">
          <h2 className="test-title">Advanced Level Reading Test</h2>
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
              <button
                className="next-btn"
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
              >
                {currentQuestion + 1 < tests.length ? "Next" : "Finish"}
              </button>
            </>
          )}
        </div>
      ) : (
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

export default AdvancedReadingTest;




