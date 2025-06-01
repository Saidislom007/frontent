import React, { useEffect, useState } from 'react';
import './demo-grammar.css';  // Pastda CSS-ni ham beraman

const API_URL = 'http://192.168.100.99:5050/api/demo/';

export default function DemoGrammar() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: '',
    correct_answer: '',
    explanation: '',
    type: 'multiple-choice',
    points: 1,
    media: { image: '' },
    shuffle_options: false
  });
  const [error, setError] = useState(null);

  // Barcha savollarni olish
  async function fetchQuestions() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Savollarni olishda xatolik');
      const data = await res.json();
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError('Savollarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Form inputlarini boshqarish
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('media.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        media: { ...prev.media, [key]: value }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  // Form yuborish
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // options ni massivga aylantirish (stringdan vergul bilan ajratilgan)
    const optionsArray = formData.options.split(',').map(opt => opt.trim()).filter(opt => opt);

    if (optionsArray.length < 2) {
      setError('Kamida 2 ta variant kiritilishi kerak (vergul bilan ajrating)');
      return;
    }

    const payload = {
      ...formData,
      options: optionsArray
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Savol yaratishda xatolik');
      const newQuestion = await res.json();
      setQuestions(prev => [...prev, newQuestion]);
      // Formni tozalash
      setFormData({
        question: '',
        options: '',
        correct_answer: '',
        explanation: '',
        type: 'multiple-choice',
        points: 1,
        media: { image: '' },
        shuffle_options: false
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>Grammar Demo Savollar</h1>

      {loading && <p className="loading-message">Yuklanmoqda...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul>
        {questions.map(q => (
          <li className="lil" key={q._id}>
            <strong>{q.question}</strong><br />
            Variantlar: {q.options.join(', ')}<br />
            To‘g‘ri javob: {q.correct_answer}<br />
            {q.media && q.media.image && (
              <img
                src={q.media.image}
                alt="Savolga oid rasm"
                className="media-image"
                onError={e => { e.target.style.display = 'none'; }}
              />
            )}
            {q.explanation && (
              <p><em>Izoh:</em> {q.explanation}</p>
            )}
          </li>
        ))}
      </ul>

      <hr />

      <h2>Yangi savol qo‘shish</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question: </label><br />
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Options (vergul bilan ajrating): </label><br />
          <input
            type="text"
            name="options"
            value={formData.options}
            onChange={handleChange}
            required
            placeholder="option1, option2, option3"
          />
        </div>

        <div>
          <label>Correct Answer: </label><br />
          <input
            type="text"
            name="correct_answer"
            value={formData.correct_answer}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Explanation: </label><br />
          <textarea
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div>
          <label>Type: </label><br />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="multiple-select">Multiple Select</option>
            <option value="fill-in-the-blank">Fill in the Blank</option>
            <option value="true-false">True/False</option>
            <option value="drag-and-drop">Drag and Drop</option>
            <option value="match-pairs">Match Pairs</option>
            <option value="reorder-sentence">Reorder Sentence</option>
            <option value="choose-the-correct-form">Choose the Correct Form</option>
            <option value="error-identification">Error Identification</option>
            <option value="sentence-completion">Sentence Completion</option>
          </select>
        </div>

        <div>
          <label>Points: </label><br />
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            min={1}
          />
        </div>

        <div>
          <label>Media Image URL: </label><br />
          <input
            type="text"
            name="media.image"
            value={formData.media.image}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="shuffle_options"
              checked={formData.shuffle_options}
              onChange={handleChange}
            /> Shuffle Options
          </label>
        </div>

        <button type="submit">Savol qo‘shish</button>
      </form>
    </div>
  );
}
