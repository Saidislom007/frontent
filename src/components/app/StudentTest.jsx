import React, { useEffect, useState } from 'react';

const API_URL = 'http://192.168.100.99:5050/api/demo/';

// Test turlarining nomlari va display uchun sarlavhalar
const TEST_TYPES = {
  'multiple-choice': 'Multiple Choice',
  'multiple-select': 'Multiple Select',
  'fill-in-the-blank': 'Fill in the Blank',
  'true-false': 'True / False',
  // Kerak bo'lsa yana qo'shish mumkin
};

export default function StudentTest() {
  const [testType, setTestType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // Savollarni olish, test turiga qarab filtrlash
  useEffect(() => {
    if (!testType) {
      setQuestions([]);
      return;
    }

    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // test turiga mos savollarni filter qilamiz
        const filtered = data.filter(q => q.type === testType);
        setQuestions(filtered);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setScore(0);
      } catch {
        alert('Savollarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [testType]);

  if (!testType) {
    return (
      <div style={styles.container}>
        <h1>Test turini tanlang</h1>
        <select
          onChange={(e) => setTestType(e.target.value)}
          defaultValue=""
          style={styles.select}
        >
          <option value="" disabled>Test turini tanlang</option>
          {Object.entries(TEST_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (loading) return <p style={styles.loading}>Yuklanmoqda...</p>;
  if (questions.length === 0) return <p style={styles.error}>Ushbu turdagi savollar topilmadi.</p>;

  const currentQuestion = questions[currentIndex];

  // Javobni o'zgartirish
  function handleAnswerChange(e) {
    const { value, checked } = e.target;
    if (testType === 'multiple-select') {
      // checkbox uchun massivda boshqarish
      if (!selectedAnswer) setSelectedAnswer([]);
      if (checked) {
        setSelectedAnswer(prev => prev ? [...prev, value] : [value]);
      } else {
        setSelectedAnswer(prev => prev.filter(v => v !== value));
      }
    } else {
      setSelectedAnswer(value);
    }
    setFeedback(null);
  }

  // Javobni tekshirish
  function checkAnswer() {
    if (
      (testType === 'multiple-select' && (!selectedAnswer || selectedAnswer.length === 0)) ||
      (!selectedAnswer && testType !== 'multiple-select')
    ) {
      alert('Iltimos, javobni tanlang.');
      return;
    }

    let isCorrect = false;

    switch (testType) {
      case 'multiple-choice':
      case 'true-false':
      case 'choose-the-correct-form':
      case 'error-identification':
        isCorrect = selectedAnswer === currentQuestion.correct_answer;
        break;

      case 'multiple-select':
        // correct_answer massiv bo'lishi kerak
        if (!Array.isArray(currentQuestion.correct_answer)) {
          alert('To‘g‘ri javob formati noto‘g‘ri.');
          return;
        }
        // tekshirish: to‘g‘ri javoblar tanlangan va boshqa tanlanmagan bo‘lishi kerak
        const correctSet = new Set(currentQuestion.correct_answer);
        const selectedSet = new Set(selectedAnswer);
        isCorrect =
          selectedAnswer.length === currentQuestion.correct_answer.length &&
          [...correctSet].every(ans => selectedSet.has(ans));
        break;

      case 'fill-in-the-blank':
        // toLowerCase va trim qilib tekshirish
        isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.correct_answer.trim().toLowerCase();
        break;

      default:
        alert('Bu test turi uchun javobni tekshirish hali qo‘llab-quvvatlanmaydi.');
        return;
    }

    if (isCorrect) {
      setFeedback({ correct: true, message: 'To‘g‘ri javob!' });
      setScore(prev => prev + (currentQuestion.points || 1));
    } else {
      setFeedback({ correct: false, message: `Noto‘g‘ri. To‘g‘ri javob: ${Array.isArray(currentQuestion.correct_answer) ? currentQuestion.correct_answer.join(', ') : currentQuestion.correct_answer}` });
    }
  }

  // Keyingi savol
  function nextQuestion() {
    setSelectedAnswer(null);
    setFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert(`Test tugadi. Sizning ballingiz: ${score} / ${questions.reduce((sum, q) => sum + (q.points || 1), 0)}`);
      setTestType('');
    }
  }

  // Render variantlar turlari bo‘yicha
  function renderOptions() {
    if (testType === 'fill-in-the-blank') {
      return (
        <input
          type="text"
          value={selectedAnswer || ''}
          onChange={e => setSelectedAnswer(e.target.value)}
          disabled={feedback !== null}
          style={styles.input}
          placeholder="Javobni kiriting"
        />
      );
    }

    if (testType === 'multiple-select') {
      return currentQuestion.options.map((opt, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <label>
            <input
              type="checkbox"
              value={opt}
              checked={selectedAnswer ? selectedAnswer.includes(opt) : false}
              onChange={handleAnswerChange}
              disabled={feedback !== null}
            />{' '}
            {opt}
          </label>
        </div>
      ));
    }

    // Multiple choice va True/False va boshqa bir variantlar uchun radio
    return currentQuestion.options.map((opt, idx) => (
      <div key={idx} style={{ marginBottom: 8 }}>
        <label>
          <input
            type="radio"
            name="answer"
            value={opt}
            checked={selectedAnswer === opt}
            onChange={handleAnswerChange}
            disabled={feedback !== null}
          />{' '}
          {opt}
        </label>
      </div>
    ));
  }

  return (
    <div style={styles.container}>
      <h1>{TEST_TYPES[testType]}</h1>

      <div style={{ background: '#f9f9f9', padding: 15, borderRadius: 8, boxShadow: '0 0 8px rgba(0,0,0,0.1)', color:"black" }}>
      <h2 style={{ marginBottom: '10px' }}>{currentQuestion.question}</h2>

        {currentQuestion.media?.image && (
        <img
            src={currentQuestion.media.image}
            alt="Savol rasmi"
            style={{
            maxWidth: '100%',
            borderRadius: 6,
            marginBottom: 15,
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            }}
        />
        )}


        {renderOptions()}

        {feedback && (
          <p style={{
            color: feedback.correct ? 'green' : 'red',
            fontWeight: 'bold',
            marginTop: 10
          }}>
            {feedback.message}
          </p>
        )}

        {!feedback ? (
          <button onClick={checkAnswer} style={styles.button}>
            Javobni tekshirish
          </button>
        ) : (
          <button onClick={nextQuestion} style={styles.button}>
            Keyingi savol
          </button>
        )}

        <p style={{ marginTop: 20 }}>
          Savol {currentIndex + 1} / {questions.length} | Ball: {score}
        </p>

        <button onClick={() => setTestType('')} style={{ marginTop: 15, ...styles.button }}>
          Test turini o‘zgartirish
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    textAlign: 'center',
  },
  select: {
    fontSize: '1rem',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1.5px solid #ccc',
    width: '60%',
  },
  button: {
    backgroundColor: '#2980b9',
    color: 'white',
    padding: '10px 18px',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color 0.3s ease',
    width: '100%',
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 5,
    border: '1.5px solid #ccc',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#2980b9',
  },
  error: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#e74c3c',
  },
};
