import "./mock_test.css";
import { Component } from "react";
import { Link } from "react-router-dom"; // ✅ Link komponenti qo‘shildi


class Mockpage extends Component {
  render() {
    return (
      <div className="container">
        <h1>You are welcome</h1>
        <div className="button-group">
          <Link to="/reading">
            <button className="btn">Reading</button> {/* ✅ Reading sahifasiga yo‘naltiradi */}
          </Link>

          <Link to="/writing">  
            <button className="btn">Writing</button> {/* ✅ BeginnerList sahifasiga yo‘naltiradi */}
          </Link>

          
        </div>
        <div className="container">
      {/* Video orqa fon */}
        <video className="video-background" autoPlay loop muted>
        <source src="/bg.mp4" type="video/mp4" />
        </video>
      </div>
      </div>

      
    );
  }
}

export default Mockpage;