import { useState } from "react";
import './QuizTest.css';

const QuizTest = ({ vocabularies, goBack, level }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(level);

  // Faol bo'lgan 10 ta so'zni tanlash
  const startLevelTest = (selectedLevel) => {
    setCurrentLevel(selectedLevel);
    const filtered = vocabularies.filter(v => v.level === selectedLevel);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setWordList(shuffled);
  };

  // If there are no words selected yet, show the level selection screen
  if (!currentLevel) {
    return (
      <div className="level-selection">
        <h2>Levelni tanlang</h2>
        <button onClick={() => startLevelTest('beginner')} className="button">Beginner</button>
        <button onClick={() => startLevelTest('intermediate')} className="button">Intermediate</button>
        <button onClick={() => startLevelTest('advanced')} className="button">Advanced</button>
      </div>
    );
  }

  // Use filtered wordList for the quiz
  const currentWord = wordList[currentIndex];

  // Create answer options: 1 correct answer + 3 incorrect answers
  const options = [
    currentWord.translation,  // Correct answer
    ...wordList
      .filter(v => v.word !== currentWord.word)  // Exclude current word
      .sort(() => Math.random() - 0.5)  // Shuffle the remaining words
      .slice(0, 3)  // Get the first 3 random options
      .map(v => v.translation)  // Get the translation of the random words
  ].sort(() => Math.random() - 0.5);  // Shuffle all the options again

  const handleAnswer = (answer) => {
    if (answer === currentWord.translation) {
      setScore(score + 1);  // Increase score for correct answer
    }
    if (currentIndex + 1 < wordList.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="quiz-container">
      {finished ? (
        <div>
          <h2>Test yakunlandi!</h2>
          <p>Sizning ballingiz: {score} / 10</p>
          <button className="button" onClick={goBack}>Orqaga</button>
        </div>
      ) : (
        <div>
          <h2 className="quizz">{currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Quiz Test</h2>
          <h2>So'z: {currentWord.word}</h2>
          <div className="options">
            {options.map(option => (
              <button key={option} className="option" onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTest;
