
import "./new.css"
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { IconBorderRadius } from "@tabler/icons-react";

const HourlyActivityChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const testdata = [12, 15, 9, 20, 17, 22, 10]
    useEffect(() => {
      const ctx = chartRef.current.getContext("2d");
  
      // Kunlik testlar soni
      const labels = ["2025-05-06", "2025-05-07", "2025-05-08", "2025-05-09", "2025-05-10", "2025-05-11", "2025-05-12"];
      const data = {
        labels,
        datasets: [
          {
            label: "Kunlik testlar soni",
            data: testdata, // har bir kun uchun testlar soni
            backgroundColor: "green",
            borderColor: "black",
            borderWidth: 2, 
          },
        ],
      };
  
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
  
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Kunlik testlar soni",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Testlar soni",
              },
            },
            x: {
              title: {
                display: true,
                text: "Sana",
              },
            },
          },
        },
      });
    }, []);
  
    return <canvas ref={chartRef} />;
  };


const HomeWorksItem = ({count,describtion}) =>{
    return(
        <div className="vazifa_item">

        <p className="count"> {count} </p>

            <div className="image_container">
                <img className="image" src="/task.png" alt="" />
            </div>
            <p className="describtion">{describtion}</p>
        </div>
    )
}
const ClassworkItem = ({count,describtion}) =>{
    return(

   
    <div className="vazifa_item2">                    
        <p className="count"> {count} </p>                                                    
        <img className="image" src="/reading.png" alt="" />

            <p className="describtion">{describtion}</p>
    </div>
    )
}


const Coin = ({coin_count})=>{
    return(<div className="coin">
        <img className= "coin_icon"src="./coin.png" alt="" />
        <p className="coin_count">{coin_count}</p>
        <p className="coin_title">coin</p>
    </div>
    )
}
const LastTestsResults = ({title,date,total_questions,foiz,correct_answers}) =>{
    
    return(

        <>
            <p className="title">
                {title}
            </p>
            <p className="date">
                {date}
            </p>

            <img  className= "img2"src="./date.png" alt="" />
            <p className="count_questions">
                {total_questions}
            </p>
            <p className="total_questions">
                Savollar soni
            </p>
            <p className="correct_answers">
                {correct_answers}
            </p>
            <p className="total_correct_answers">
                To'g'ri javoblar  soni
            </p>
            <p className="foiz">
                {foiz}%
            </p>
            <p className="natija">
                Natija
            </p>
            <button className="show">
                Ko'rish
            </button>
        </>
        
    )
}


const profile = () =>{
    return(
        <div className="main">

            <div className="profile_items">
                <Xp
                xp_count={3}
                />
                <Coin
                coin_count={2}
                />

            </div>
            <div className="vazifa_container">
                <p className="p">Mening Vazifalarim</p>
                <HomeWorksItem
                count={0}
                describtion={"Sizda uyga vazifalar yo'q"}
                />
                <ClassworkItem
                count={0}
                describtion={"Sizda sinf vazifalari yo'q"}
                />

            </div>
            <div className="vazifa_container2">
                <p className="p"></p>

            </div>
            <div className="last_tests_container">
                <p className="last">So'nggi  3 ta test natijalari </p>
                <div className="last_tests">
                        <div className="item1">
                                <LastTestsResults
                                    title={"Test 1"}
                                    date={"10-may"}
                                    total_questions={12}
                                    correct_answers={5}
                                    foiz={12}
                                />
                        </div>
                        <div className="item2">
                            <LastTestsResults
                                title={"Test 2"}
                                date={"1- iyun"}
                                total_questions={15}
                                correct_answers={15}
                                foiz={100}
                            />
                        </div>
                        <div className="item3">
                            <LastTestsResults
                                    title={"Test 3"}
                                    date={"1- iyul"}
                                    total_questions={25}
                                    correct_answers={24}
                                    foiz={99}
                                />
                        </div>
                </div>
            </div>
            <div className="live_test">

            </div>

            <div className="schedulue">
            <   HourlyActivityChart/>
            </div>
        </div>

    )
}



import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




const initialWords = ["I", "am", "a", "doctor"];

const Drag = () => {
  const [words, setWords] = useState(shuffleArray(initialWords));
  const [droppedWords, setDroppedWords] = useState(Array(initialWords.length).fill(null));
  const [result, setResult] = useState("");

  function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  const handleDrop = (e, index) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text");
    const newDroppedWords = [...droppedWords];
    newDroppedWords[index] = word;
    setDroppedWords(newDroppedWords);
  };

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text", word);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCheck = () => {
    if (droppedWords.join(" ") === initialWords.join(" ")) {
      setResult("✅ To'g'ri!");
    } else {
      setResult("❌ Noto'g'ri. Qaytadan urinib ko'ring.");
    }
  };

  const handleReset = () => {
    setWords(shuffleArray(initialWords));
    setDroppedWords(Array(initialWords.length).fill(null));
    setResult("");
  };

  return (
    <div className="container">
      <h2>So'zlarni to'g'ri tartibda joylashtiring</h2>

      <div className="word-bank">
        {words.map((word, idx) => (
          <div
            key={idx}
            className="draggable"
            draggable
            onDragStart={(e) => handleDragStart(e, word)}
          >
            {word}
          </div>
        ))}
      </div>

      <div className="drop-area">
        {droppedWords.map((word, idx) => (
          <div
            key={idx}
            className="drop-slot"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
          >
            {word}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={handleCheck}>Check Answer</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <div className="result">{result}</div>
    </div>
  );
};




const Newprofile = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState({});
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem("userId"));
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
          setUser(userResponse.data);
          setSkills(userResponse.data.skills || {});
          setTests(userResponse.data.tests || {}); // Test natijalarini oling
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
  return(
        <div className="main">
            <div className="profile_items">

                <Coin
                coin_count={2}
                />

            </div>
            <div className="vazifa_container">
                <p className="p">Mening Vazifalarim</p>
                <HomeWorksItem
                count={0}
                describtion={"Sizda uyga vazifalar yo'q"}
                />
                <ClassworkItem
                count={0}
                describtion={"Sizda sinf vazifalari yo'q"}
                />

            </div>
            <div className="vazifa_container2">
                <p className="p"></p>

            </div>
            <div className="last_tests_container">
            <p className="last">So'nggi 3 ta test natijalari</p>
            <div className="last_tests">
            {Object.keys(tests)
                .flatMap((testKey) => {
                const test = tests[testKey];
                return test.testHistory.map((history) => ({
                    title: testKey.charAt(0).toUpperCase() + testKey.slice(1),
                    date: new Date(history.date).toLocaleDateString(),
                    total_questions: history.totalQuestions,
                    correct_answers: history.correctAnswers,
                    foiz: Math.round((history.correctAnswers / history.totalQuestions) * 100),
                }));
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Eng yangi testlar birinchi
                .slice(0, 3) // Faqat oxirgi 3 ta
                .map((result, index) => (
                <div key={index} className={`item${index + 1}`}>
                    <LastTestsResults
                    title={result.title}
                    date={result.date}
                    total_questions={result.total_questions}
                    correct_answers={result.correct_answers}
                    foiz={result.foiz}
                    />
                </div>
                ))}
            </div>

            </div>
            <div className="live_test">

            </div>

            <div className="schedulue">
            <   HourlyActivityChart/>
            </div>
            <div className="container">
                <Drag/>
            </div>
        </div>

    )

}

export default Newprofile