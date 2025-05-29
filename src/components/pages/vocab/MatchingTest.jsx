import { useState, useEffect } from "react";
import './MatchingTest.css';

const MatchingTest = ({ vocabularies, goBack }) => {
  const [level, setLevel] = useState('');
  const [wordList, setWordList] = useState([]);
  const [translationList, setTranslationList] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [completed, setCompleted] = useState(false);

  // Start test with selected level
  const startLevelTest = (selectedLevel) => {
    setLevel(selectedLevel);
    const filtered = vocabularies.filter(v => v.level === selectedLevel);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setWordList(shuffled);
    setTranslationList([...shuffled].sort(() => Math.random() - 0.5));
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleTranslationClick = (translation) => {
    if (!selectedWord) return;

    if (selectedWord.translation === translation.translation) {
      setMatches([...matches, selectedWord.word]);
      setScore(score + 1);
      const newWords = wordList.filter(w => w.word !== selectedWord.word);
      const newTranslations = translationList.filter(t => t.translation !== translation.translation);
      setWordList(newWords);
      setTranslationList(newTranslations);
    } else {
      setLives(lives - 1);
    }

    setSelectedWord(null);
  };

  useEffect(() => {
    if (lives <= 0 || matches.length === 10) {
      setCompleted(true);
    }
  }, [lives, matches]);

  if (!level) {
    return (
      <div className="level-selection">
        <h2>Levelni tanlang</h2>
        <button onClick={() => startLevelTest('beginner')} className="button">Beginner</button>
        <button onClick={() => startLevelTest('intermediate')} className="button">Intermediate</button>
        <button onClick={() => startLevelTest('advanced')} className="button">Advanced</button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="matching-container">
        <h2>{level.charAt(0).toUpperCase() + level.slice(1)} Matching Test</h2>
        <p>{lives <= 0 ? "Test yakunlandi! Jondan ayrildingiz." : "Test tugallandi!"}</p>
        <p>Ball: {score}</p>
        <button onClick={goBack} className="button">Orqaga</button>
      </div>
    );
  }

  return (
    <div className="matching-container">
      <h2>{level.charAt(0).toUpperCase() + level.slice(1)} Matching Test</h2>
      <p>So‘z va tarjimasini juftlang.</p>

      <div className="matching-grid">
        <div className="words">
          {wordList.map(word => (
            <div
              key={word.word}
              className={`card ${matches.includes(word.word) ? 'matched' : selectedWord?.word === word.word ? 'selected' : ''}`}
              onClick={() => handleWordClick(word)}
            >
              {word.word}
            </div>
          ))}
        </div>

        <div className="translations">
          {translationList.map(trans => (
            <div
              key={trans.translation}
              className="card"
              onClick={() => handleTranslationClick(trans)}
            >
              {trans.translation}
            </div>
          ))}
        </div>
      </div>

      <div className="score">Ball: {score} | Qolgan urinishlar: {lives}</div>
    </div>
  );
};

export default MatchingTest;
