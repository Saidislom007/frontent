// components/AdminPage.js
import React, { Component } from "react";
import ReadingTestComponent from "../reading_test/ReadingTestComponent";
import VocabularyTestComponent from "../vocab_test/VocabularyTestComponent";
import GrammarTest from "../grammar_test/grammarTest";
import AllTestsPage from "../test/allTests";
import CreateTestPage from "../test/createTest";
import EditTestPage from "../test/editTest";

class AdminPage extends Component {
  render() {
    return (
      <div className="admin-page">
        <h1>Welcome to the Admin Page</h1>

        {/* Reading Test Qo'shish */}
        {/* <ReadingTestComponent /> */}
        <AllTestsPage/>
        <CreateTestPage/>
        <EditTestPage/>
        {/* Vocabulary Test Qo'shish */}
        {/* <VocabularyTestComponent /> */}
        <GrammarTest/>
      </div>
    );
  }
}

export default AdminPage;
