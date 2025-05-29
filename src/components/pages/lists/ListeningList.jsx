import { useNavigate } from "react-router-dom";
import "./ListeningList.css"; 
import { FaHeadphones } from "react-icons/fa";

const ListeningList = () => {
  const navigate = useNavigate();

  return (
    <div className="beginner-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Ortga
      </button>

      <div className="beginner-card">
        <h1 className="beginner-title">
          <FaHeadphones />  Listening
        </h1>
        <p className="beginner-subtitle">
          Bu yerda turli darajadagi listening testlari mavjud. Quyidagilardan birini tanlang.
        </p>

        <div className="test-options">
          <div className="test-card" onClick={() => navigate("/beginnerListening")}>
            🎧 begginer
          </div>

          <div className="test-card" onClick={() => navigate("/intermediteListening")}>
            🎧 intermedite
          </div>

          <div className="test-card" onClick={() => navigate("/AdvancedListeningTest")}>
            🎧 advance
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningList;
