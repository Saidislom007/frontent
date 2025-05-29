import { useState } from "react";
import "./writing.css";
import { useNavigate } from "react-router-dom";

export default function WritingTest() {
  const [writing, setWriting] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const updateWritingSkill = async (ieltsScore) => {
    if (isNaN(ieltsScore)) return;

    try {
      const response = await fetch(
        `http://192.168.1.11:5050/api/auth/update-skill/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ writing: ieltsScore }),
        }
      );

      if (response.ok) {
        console.log("✅ Writing skill updated successfully");
        setIsUpdated(true);
      } else {
        console.error("❌ Failed to update writing skill");
      }
    } catch (error) {
      console.error("❌ Error updating writing skill:", error);
    }
  };

  const checkWriting = async () => {
    if (!writing.trim()) {
      setFeedback(null);
      setScore(null);
      setIsUpdated(false);
      setError("❗ Iltimos, yozgan matningizni kiriting.");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.11:5050/api/check-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: writing }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Serverdan kelgan javob:", data);

      if (data.feedback) {
        setFeedback(data.feedback);
        setError(null);

        const parsedScore = parseFloat(data.score);
        setScore(!isNaN(parsedScore) ? parsedScore : "Not available");

        if (!isNaN(parsedScore)) {
          updateWritingSkill(parsedScore);
        }
      } else {
        setFeedback("❗ AI'dan to‘g‘ri javob kelmadi.");
        setScore(null);
      }
    } catch (error) {
      console.error("❌ Xatolik yuz berdi:", error.message);
      setFeedback(null);
      setScore(null);
      setError("❌ Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">📝 IELTS Writing Checker</h1>

      <textarea
        className="w-full h-40 p-3 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
        value={writing}
        onChange={(e) => setWriting(e.target.value)}
        placeholder="Write your IELTS essay here..."
      />

      <button
        className="mt-4 px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        onClick={checkWriting}
      >
        ✅ Check Writing
      </button>

      {error && (
        <p className="mt-3 text-red-600 font-medium">{error}</p>
      )}

      {feedback && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100 shadow-md">
          <h3 className="font-bold text-lg">📌 Feedback:</h3>
          <p className="mt-2">{feedback}</p>

          {score !== null && (
            <p className="mt-3 text-lg font-bold text-blue-600">
              IELTS Score: {score} / 9
            </p>
          )}

          {isUpdated && (
            <p className="mt-2 text-green-600 font-semibold">
              ✅ Writing skill updated successfully!
            </p>
          )}

          <button
            className="mt-3 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setFeedback(null);
              setScore(null);
              setIsUpdated(false);
              setError(null);
              setWriting("");
            }}
          >
            ❌ Clear
          </button>
        </div>
      )}
    </div>
  );
}
