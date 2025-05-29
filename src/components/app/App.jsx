import React, { useState, useEffect } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

// Import Components
import NavBar from "../navbar/navbar";
import Homepage from "../home/home";
import UserCardImage from "../profile/Profile";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import ProtectedRoute from "../pages/register/ProtectedRoute";
import Newprofile from "../pages/newProfile"


// Test Pages
import ReadingPage from '../pages/tests/readingTests/ReadingPage';
import BeginnerReadingTest from '../pages/tests/readingTests/BeginnerReadingTest';
import IntermediateReadingTest from '../pages/tests/readingTests/IntermediateReadingTest';
import AdvancedReadingTest from '../pages/tests/readingTests/AdvancedReadingTest';
import WritingTest from '../pages/tests/WritingTest/WritingTest';
import SpeakingMock from '../pages/tests/SpeakingTests/SpeakingTest';
import BeginnerListeningList from '../pages/lists/BeginnerlisteningList';
import IntermediateListeningTest from '../pages/lists/IntermeditelisteningList';
import AdvancedListeningTest from '../pages/lists/AdvancedListeningTest';
import ListeningList from '../pages/lists/ListeningList';
import VocabularyList from "../pages/vocab/VocabPage";
import TranslateComponent from '../pages/vocab/TranslateComponent'
import GrammarTest from "../pages/grammar/GrammarTest";
import Demo from "./demo"
import St from "./StudentTest"


// Admin Pages
import AdminPage from "../pages/admin/admin/admin";
import AdminRegistration from "../pages/admin/register/adminRegister";
import AdminLogin from "../pages/admin/login/adminLogin";



// Misc Pages
import Mockpage from "../pages/mock_folder/mock_page";
import Leaderboard from "../leaderBoard/leaderBoard";
import TestsPage from "../pages/testsPage/testsPage"

// Color Scheme Setup
import { localStorageColorSchemeManager } from "@mantine/core";

// Mantine theme setup
const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});

const colorSchemeManager = localStorageColorSchemeManager({
  key: "my-app-color-scheme",
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Authentication Check
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) return;

        const response = await axios.get(
          `http://192.168.100.99:5050/api/auth/get-profile/${storedUserId}`,
          { withCredentials: true }
        );
        if (response.data) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  // Set Authentication Status
  const setAuthStatus = (status, userId = null) => {
    setIsAuthenticated(status);
    setUserId(userId);
    if (status) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  };

  return (
    <MantineProvider theme={theme}>
      <Router>
        <NavBar />
        <Routes>
          {/* Test Routes */}
          <Route path="/beginnerListening" element={<BeginnerListeningList />} />
          <Route path="/intermediateListening" element={<IntermediateListeningTest />} />
          <Route path="/writing" element={<WritingTest />} />
          <Route path="/speaking" element={<SpeakingMock />} />
          <Route path="/AdvancedListeningTest" element={<AdvancedListeningTest />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/reading/beginner" element={<BeginnerReadingTest />} />
          <Route path="/reading/intermediate" element={<IntermediateReadingTest />} />
          <Route path="/reading/advanced" element={<AdvancedReadingTest />} />
          <Route path="/listening" element={<ListeningList />} />
          <Route path="/vocab" element={<VocabularyList />} />
          <Route path="/tr" element={<TranslateComponent />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path= "/new" element={<Newprofile/>}/>
          <Route path = "/gr" element={<GrammarTest/>}/>
          <Route path="/l" element = {<Demo/>}/>
          <Route path ="/s" element = {<St/>}/>

          {/* Admin Routes */}
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/admin/register" element={<AdminRegistration />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Misc Routes */}
          <Route path="/top" element={<Leaderboard />} />
          
          <Route path="/mocks" element={<Mockpage />} />
          <Route path="/" element={<Homepage />} exact />

          
          {/* Auth Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setAuthStatus} />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserCardImage userId={userId} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
