import React, { Component } from "react";

class ReadingTestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassage: "",
      newQuestion: "",
      newOptions: ["", "", "", ""],
      newCorrectAnswer: "",
      newLevel: "",
      error: "",
    };
  }

  handleInputChange = (index, value) => {
    const updatedOptions = [...this.state.newOptions];
    updatedOptions[index] = value;
    this.setState({ newOptions: updatedOptions });
  };

  handleCreateTest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Admin login qilmagan!");
      return;
    }

    const newTest = {
      passage: this.state.newPassage,
      question: this.state.newQuestion,
      options: this.state.newOptions,
      answer: this.state.newCorrectAnswer,
      level: this.state.newLevel,
    };

    try {
      const response = await fetch("http://192.168.100.99:5050/api/readingTest/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTest),
      });

      const data = await response.json();
      if (response.ok) {
        this.setState({
          newPassage: "",
          newQuestion: "",
          newOptions: ["", "", "", ""],
          newCorrectAnswer: "",
          newLevel: "",
        });
        alert("Test yaratildi!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Test yaratishda xato yuz berdi.");
    }
  };

  render() {
    const { newPassage, newQuestion, newOptions, newCorrectAnswer, newLevel, error } = this.state;

    return (
      <div className="create-test">
        <h2>Create a New Reading Test</h2>
        <div>
          <label>Passage:</label>
          <textarea
            value={newPassage}
            onChange={(e) => this.setState({ newPassage: e.target.value })}
            rows="4"
            className="input"
            required
          />
        </div>

        <div>
          <label>Question:</label>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => this.setState({ newQuestion: e.target.value })}
            placeholder="Enter the question"
            className="input"
            required
          />
        </div>

        <div>
          <label>Options:</label>
          {newOptions.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => this.handleInputChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="input"
              required
            />
          ))}
        </div>

        <div>
          <label>Correct Answer:</label>
          <select
            value={newCorrectAnswer}
            onChange={(e) => this.setState({ newCorrectAnswer: e.target.value })}
            className="input"
            required
          >
            <option value="">Select Correct Answer</option>
            {newOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Level:</label>
          <select
            value={newLevel}
            onChange={(e) => this.setState({ newLevel: e.target.value })}
            className="input"
            required
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button onClick={this.handleCreateTest} className="button">
          Create Test
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

export default ReadingTestComponent;
