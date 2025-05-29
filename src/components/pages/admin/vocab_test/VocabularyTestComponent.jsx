import React, { Component } from "react";

class VocabularyTestComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newWord: "",
      newTranslation: "",
      newLevel: "",
      newDescription: "",
      error: "",
    };
  }

  handleCreateTest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Admin login qilmagan!");
      return;
    }

    const newVocabulary = {
      word: this.state.newWord,
      translation: this.state.newTranslation,
      level: this.state.newLevel,
      description: this.state.newDescription,
    };

    try {
      const response = await fetch("http://192.168.100.99:5050/api/vocab/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVocabulary),
      });

      const data = await response.json();
      if (response.ok) {
        this.setState({
          newWord: "",
          newTranslation: "",
          newLevel: "",
          newDescription: "",
        });
        alert("Vocabulary word yaratildi!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Vocabulary yaratishda xato yuz berdi.");
    }
  };

  render() {
    const { newWord, newTranslation, newLevel, newDescription, error } = this.state;

    return (
      <div className="create-vocabulary">
        <h2>Create a New Vocabulary</h2>
        
        <div>
          <label>Word:</label>
          <input
            type="text"
            value={newWord}
            onChange={(e) => this.setState({ newWord: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label>Translation:</label>
          <input
            type="text"
            value={newTranslation}
            onChange={(e) => this.setState({ newTranslation: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => this.setState({ newDescription: e.target.value })}
            className="input"
            required
          />
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
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button onClick={this.handleCreateTest} className="button">
          Create Vocabulary
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}

export default VocabularyTestComponent;
