import { useEffect, useState } from "react";
import axios from "axios";
import './VocabularyList.css';

import MatchingTest from './MatchingTest';
import QuizTest from './QuizTest';

const VocabularyList = () => {
  const [vocabularies, setVocabularies] = useState([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [showMatchingTest, setShowMatchingTest] = useState(false);
  const [showQuizTest, setShowQuizTest] = useState(false);

  const fetchVocabularies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.100.99:5050/api/vocab/all');
      setVocabularies(response.data.data);
      setFilteredVocabularies(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabularies();
  }, []);

  useEffect(() => {
    let updatedList = vocabularies;

    if (levelFilter !== "all") {
      updatedList = updatedList.filter(vocab => vocab.level.toLowerCase() === levelFilter);
    }

    if (searchTerm.trim() !== "") {
      updatedList = updatedList.filter(vocab =>
        vocab.word.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVocabularies(updatedList);
  }, [searchTerm, levelFilter, vocabularies]);

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">{error}</div>;

  if (showMatchingTest) {
    return <MatchingTest vocabularies={filteredVocabularies} goBack={() => setShowMatchingTest(false)} />;
  }

  if (showQuizTest) {
    return <QuizTest vocabularies={filteredVocabularies} goBack={() => setShowQuizTest(false)}   />;
  }

  return (
    <div className="container">
      <h1 className="title">Vocabulary List</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="So'z qidiring..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="select"
        >
          <option value="all">Barcha Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button onClick={fetchVocabularies} className="button">Yangilash</button>
      </div>

      <div className="test-buttons">
        <button className="button" onClick={() => setShowMatchingTest(true)}>Matching Test</button>
        <button className="button" onClick={() => setShowQuizTest(true)}>Quiz Test</button>
      </div>

      {filteredVocabularies.length === 0 ? (
        <div className="no-results">Hech qanday so'z topilmadi.</div>
      ) : (
        <div className="table-wrapper">
          <table className="vocabulary-table">
            <thead>
              <tr className="th1">
                <th >№</th>
                <th >Word</th>
                <th >Translation</th>
                <th >Level</th>
                <th >Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredVocabularies.map((vocab, index) => (
                <tr  key={vocab._id}>
                  <td>{index + 1}</td>
                  <td>{vocab.word}</td>
                  <td>{vocab.translation}</td>
                  <td>{vocab.level}</td>
                  <td>{vocab.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VocabularyList;
