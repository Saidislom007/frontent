import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// PDF.js kutubxonasini import qilish
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BeginnerListeningList = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [listeningMock, setListeningMock] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchTestData = async () => {
    try {
      const response = await fetch(`http://192.168.1.11:5050/api/listening-mocks/`);
      const data = await response.json();
      setListeningMock(data[0]);
      setPdfFile(data[0].pdf_file);  // Serverdan PDF faylini olish
    } catch (error) {
      console.error("❌ Error fetching listening mocks:", error);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === listeningMock.questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion + 1 < listeningMock.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null); // Clear selected answer
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
          const response = await fetch(
            `http://192.168.1.40:5050/api/auth/update-skill/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ listening: score }),
            }
          );

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

  if (!listeningMock) {
    return <div>Loading test data...</div>;
  }

  return (
    <div className="reading-test-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      {!showTest ? (
        <div className="reading-container">
          <h2 className="reading-title">{listeningMock.title}</h2>
          <button className="start-test-btn" onClick={() => setShowTest(true)}>
            Start Test
          </button>
        </div>
      ) : !showResult ? (
        <div className="test-container">
          <h2 className="test-title">{listeningMock.title}</h2>

          {/* PDF faylini render qilish */}
          <div>
            {pdfFile && (
              <Document file={`http://192.168.1.40:5050${pdfFile}`}>
                <Page pageNumber={1} />
              </Document>
            )}
          </div>

          <AudioPlayer
            src={`http://192.168.1.40:5050${listeningMock.audio_file}`}
            onPlay={() => console.log("Playing...")}
          />
          <h3 className="question">{listeningMock.questions[currentQuestion].question}</h3>
          <div className="options">
            {listeningMock.questions[currentQuestion].options.map((option, index) => (
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
            {currentQuestion + 1 < listeningMock.questions.length ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div className="result-container">
          <h2 className="result-title">Test Completed!</h2>
          <p className="score-text">
            Your Score: {score} / {listeningMock.questions.length}
          </p>
          <h3 className="result-message">
            {score >= 7
              ? "Malades! 🎉"
              : score >= 4
              ? "Yaxshi o‘qi! 📚"
              : "Ko‘proq mashq qil! 🔄"}
          </h3>
          <h3 className="result-message">IELTS Band Score: {calculateBandScore(score)}</h3>
        </div>
      )}
    </div>
  );
};

export default BeginnerListeningList;
