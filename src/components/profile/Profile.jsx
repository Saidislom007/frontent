import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const UserCardImage = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState({});
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(""); // Avatar URL uchun state
  const canvasRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (!userId) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get(
          `http://192.168.100.99:5050/api/auth/get-profile/${userId}`,
          { withCredentials: true }
        );

        if (userResponse.data) {
          const fetchedUser = userResponse.data;
          setUser(fetchedUser);
          setSkills(fetchedUser.skills || {});
          setTests(fetchedUser.tests || {});

          if (!fetchedUser.imageUrl && fetchedUser.name) {
            const avatar = generateAvatar(fetchedUser.name);
            setAvatarUrl(avatar); // Agar rasm URL mavjud bo'lmasa, avatar yaratish
          } else {
            setAvatarUrl(fetchedUser.imageUrl); // Rasm URL si mavjud bo'lsa, uni ishlatish
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const generateAvatar = (fullname, size = 100) => {
    const canvas = canvasRef.current;
    if (!canvas) return ""; // Agar canvas mavjud bo'lmasa, bo'sh string qaytarish

    const ctx = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    const bgColor = "#3498db"; // Orqa fon rangi
    const textColor = "#fff"; // Matn rangi

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = textColor;
    ctx.font = `${size / 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fullname.charAt(0).toUpperCase(), size / 2, size / 2); // Foydalanuvchi ismining birinchi harfini chiqarish

    return canvas.toDataURL(); // Canvasni data URL formatida qaytarish
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card">
        <p>User not found or not logged in.</p>
      </div>
    );
  }

  return (
    <div className="user-card">
      <div className="card-banner" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="user-avatar"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      )}
      <p className="user-name">{user.name}</p>

      <div className="divider" />

      <p className="section-title">My Skill Descriptions</p>
      <div className="skills-group">
        {["reading", "writing", "speaking", "listening"].map((skill) => (
          <div key={skill} className="skill-item">
            <p className="skill-name">{skill.charAt(0).toUpperCase() + skill.slice(1)}</p>
            <p className="skill-level">{skills[skill] || 0}</p>
          </div>
        ))}
      </div>

      <div className="divider" />

      <p className="section-title">Test Results</p>
      <div className="test-list">
        {Object.keys(tests).map((testKey) => {
          const test = tests[testKey];
          return (
            <div key={testKey} className="test-item">
              <p className="test-name">
                {testKey.charAt(0).toUpperCase() + testKey.slice(1)} Test
              </p>
              <ul>
                <li><strong>Total Score:</strong> {test.totalScore}</li>
                <li><strong>Correct Answers:</strong> {test.correctAnswers}</li>
                <li><strong>Incorrect Answers:</strong> {test.incorrectAnswers}</li>
              </ul>

              <div className="divider" />

              <p className="test-history-title">Test History:</p>
              {test.testHistory.length > 0 ? (
                <ul className="test-history">
                  {test.testHistory.map((history, index) => (
                    <li key={index}>
                      <p><strong>Date:</strong> {new Date(history.date).toLocaleDateString()}</p>
                      <p><strong>Score:</strong> {history.score}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-history">No history available.</p>
              )}
            </div>
          );
        })}
      </div>

      <button className="edit-button">Get Statistics</button>
    </div>
  );
};

export default UserCardImage;
