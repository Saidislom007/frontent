import { useState } from 'react';
import axios from 'axios';
import "./tr.css";

function Translator() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('uz');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert('Iltimos, matn kiriting!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://google-translator9.p.rapidapi.com/v2',
        {
          q: inputText,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        },
        {
          headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
            'x-rapidapi-key': import.meta.env.VITE_API_KEY
          }
        }
      );

      const translated = response.data?.data?.translations?.[0]?.translatedText;
      if (translated) {
        setTranslatedText(translated);
      } else {
        setTranslatedText('❌ Tarjima topilmadi.');
      }
    } catch (error) {
      console.error('❌ Tarjima xatosi:', error.response?.data || error.message);
      setTranslatedText('❌ Tarjima xatosi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translator-container">
      <h1>🌎 Translator</h1>

      <div className="select-container">
        <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
          <option value="en">🇬🇧 English</option>
          <option value="uz">🇺🇿 Uzbek</option>
        </select>

        <span>➡️</span>

        <select value={targetLang} onChange={e => setTargetLang(e.target.value)}>
          <option value="uz">🇺🇿 Uzbek</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      <textarea
        rows="4"
        placeholder="Tarjima qilinadigan matn..."
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      ></textarea>

      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Tarjima qilinmoqda...' : 'Tarjima qilish'}
      </button>

      {translatedText && (
        <div className="translated-result">
          <strong>🔄 Tarjima natijasi:</strong>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default Translator;
