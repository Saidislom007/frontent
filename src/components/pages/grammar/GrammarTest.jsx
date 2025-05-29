import React, { useState, useEffect } from "react";
import './GrammarTest.css';

const GrammarTest = () => {
  const [level, setLevel] = useState(null); // Darajani saqlash
  const [grammarTests, setGrammarTests] = useState([]); // Grammar testlarini saqlash
  const [currentIndex, setCurrentIndex] = useState(0); // Joriy test indexi
  const [score, setScore] = useState(0); // Foydalanuvchining ballari
  const [finished, setFinished] = useState(false); // Test tugadi holati
  const [loading, setLoading] = useState(true); // Yuklanayotgan holat
  const [testStarted, setTestStarted] = useState(false); // Testni boshlash holati

  // Grammar testlarini API orqali olish
  useEffect(() => {
    const fetchGrammarTests = async () => {
      try {
        const response = await fetch("http://192.168.100.99:5050/api/grammar/get-all-grammar-tests");
        const data = await response.json();
        
        if (response.ok) {
          setGrammarTests(data.data); // Olingan testlarni saqlash
          setLoading(false); // Testlar yuklandi, loadingni false qilish
        } else {
          console.error("Failed to fetch grammar tests");
        }
      } catch (error) {
        console.error("Error fetching grammar tests:", error);
      }
    };

    fetchGrammarTests();
  }, []); // Faqat komponent mount bo'lganda ishga tushadi

  // Daraja bo'yicha testlarni filtrlash
  const filteredTests = grammarTests.filter(test => test.difficulty === level);
  const currentTest = filteredTests[currentIndex]; // Joriy test

  // Foydalanuvchi to'g'ri javobni tanlasa
  const handleAnswer = (answer) => {
    if (answer === currentTest.content.correct_answer) {
      setScore(score + 1); // Ballarni oshirish
    }

    // Agar yana testlar bo'lsa, keyingi testga o'tish
    if (currentIndex + 1 < filteredTests.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true); // Agar testlar tugasa, testni tugatish
    }
  };

  // Darajani tanlash
  const startLevelTest = (selectedLevel) => {
    setLevel(selectedLevel); // Tanlangan darajani o'rnatish
    setTestStarted(true); // Testni boshlash
  };

  // Testni tugatganidan keyin boshlang'ich holatga qaytish
  const goBack = () => {
    setTestStarted(false);
    setLevel(null); // Darajani va testni qayta boshlash
  };

  // Yuklanayotgan holatni ko'rsatish
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grammar-test-container">
      {!testStarted ? (
        <div className="level-selection">
          <h2>Levelni tanlang</h2>
          <button onClick={() => startLevelTest('beginner')} className="button">Beginner</button>
          <button onClick={() => startLevelTest('intermediate')} className="button">Intermediate</button>
          <button onClick={() => startLevelTest('advanced')} className="button">Advanced</button>
        </div>
      ) : finished ? (
        <div className="result-container">
          <h2>Test Completed!</h2>
          <p>Your score: {score} / {filteredTests.length}</p>
          <button className="button" onClick={goBack}>Go Back</button>
        </div>
      ) : (
        <div className="test-container">
          <h2 className="quiz-title">{level ? level.charAt(0).toUpperCase() + level.slice(1) : "No Level"}</h2>
          <h3  className="quiz-title">{currentTest?.content?.question}</h3>

          <div className="options">
            {currentTest?.content?.options.map((option, idx) => (
              <button key={idx} className="option" onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarTest;
