import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DocumentWorkspacePage from "./pages/DocumentWorkspacePage.jsx";
import QuizAttemptPage from "./pages/QuizAttemptPage.jsx";
import AttemptResultsPage from "./pages/AttemptResultsPage.jsx";
import FlashcardReviewPage from "./pages/FlashcardReviewPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import StudyPlansListPage from "./pages/StudyPlansListPage.jsx";
import StudyPlanPage from "./pages/StudyPlanPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/documents/:id" element={<DocumentWorkspacePage />} />
        <Route path="/quizzes/:id/attempt" element={<QuizAttemptPage />} />
        <Route path="/attempts/:id" element={<AttemptResultsPage />} />
        <Route path="/flashcards/review" element={<FlashcardReviewPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/study-plans" element={<StudyPlansListPage />} />
        <Route path="/study-plans/:id" element={<StudyPlanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}