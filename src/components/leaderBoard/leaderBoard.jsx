import React, { useEffect, useState } from "react";
import './leaderBoard.css'; // CSS faylini import qilish

const rankColors = ["rank-1", "rank-2", "rank-3"];

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://192.168.100.99:5050/api/user/leaderboard");
        const data = await res.json();
        setTopUsers(data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-title">
        <h2>🏆 Leaderboard</h2>
        <p>Top 10 English learners</p>
      </div>

      <ul className="leaderboard-list">
        {topUsers.map((user, index) => (
          <li key={user.id} className="leaderboard-item">
            <div className="flex items-center gap-4">
              <div
                className={`leaderboard-item-number ${rankColors[index] || "bg-blue-500"}`}
              >
                {index + 1}
              </div>
              <div className="leaderboard-item-name">{user.fullname}</div>
            </div>
            <div className="leaderboard-item-points">{user.totalScore} pts</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
