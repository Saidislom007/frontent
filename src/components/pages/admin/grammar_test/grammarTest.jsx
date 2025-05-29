import React, { Component } from "react";

class GrammarTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newText: "",
      newDifficulty: "",
      newCorrectAnswer: "",
      newCategory: "",
      error: "",
    };
  }

  handleCreateTest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Admin login qilmagan!");
      return;
    }

    const newTest = {
      text: this.state.newText,
      difficulty: this.state.newDifficulty,
      correct_answer: this.state.newCorrectAnswer,
      category: this.state.newCategory,
    };

    try {
      const response = await fetch(
        "http://192.168.100.99:5050/api/grammar/create-grammar-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTest),
        }
      );

      const data = await response.json();
      if (response.ok) {
        this.setState({
          newText: "",
          newDifficulty: "", // <-- TO‘G‘RILANGAN: oldin bu yerda array edi
          newCorrectAnswer: "",
          newCategory: "",
          error: "",
        });
        alert("Test yaratildi!");
      } else {
        this.setState({ error: data.message });
      }
    } catch (err) {
      console.error(err);
      this.setState({ error: "Test yaratishda xato yuz berdi." });
    }
  };

  render() {
    const {
      newText,
      newDifficulty,
      newCorrectAnswer,
      newCategory,
      error,
    } = this.state;

    return (
      <div className="create-test">
        <h2>Create a New Grammar Test</h2>
        <div>
          <label>Text:</label>
          <textarea
            value={newText}
            onChange={(e) => this.setState({ newText: e.target.value })}
            rows="4"
            className="input"
            placeholder="Enter the grammar text"
            required
          />
        </div>
        <div>
          <label>Correct answer:</label>
          <input
            type="text"
            value={newCorrectAnswer}
            onChange={(e) =>
              this.setState({ newCorrectAnswer: e.target.value })
            }
            placeholder="Enter the correct answer"
            className="input"
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => this.setState({ newCategory: e.target.value })}
            placeholder="Enter the category"
            className="input"
            required
          />
        </div>

        <div>
          <label>Difficulty:</label>
          <select
            value={newDifficulty}
            onChange={(e) =>
              this.setState({ newDifficulty: e.target.value })
            }
            className="input"
            required
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
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

export default GrammarTest;
