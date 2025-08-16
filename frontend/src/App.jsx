import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ContextDetails from "./pages/ContextDetails";
import SubmitFeedbackPage from "./pages/SubmitFeedbackPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />
        <Route
          path="/context/:id"
          element={
            <ProtectedRoute>
              <ContextDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-feedback/:contextId"
          element={
            <SubmitFeedbackPage />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;