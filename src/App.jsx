import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import GuestRoute from "./components/layout/GuestRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DocumentWorkspacePage from "./pages/DocumentWorkspacePage.jsx";
import AttemptResultsPage from "./pages/AttemptResultsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import StudyPlansListPage from "./pages/StudyPlansListPage.jsx";
import StudyPlanPage from "./pages/StudyPlanPage.jsx";
import QuizAttemptPage from "./pages/QuizAttemptPage.jsx";
import FlashcardReviewPage from "./pages/FlashcardReviewPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with the shared navbar + footer */}
        <Route element={<AppLayout />}>
          {/* Auth pages: only reachable when logged out */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Everything else: only reachable when logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/documents/:id" element={<DocumentWorkspacePage />} />
            <Route path="/attempts/:id" element={<AttemptResultsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/study-plans" element={<StudyPlansListPage />} />
            <Route path="/study-plans/:id" element={<StudyPlanPage />} />
          </Route>
        </Route>

        {/* Focused, distraction-free screens: no navbar/footer, but still protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/quizzes/:id/attempt" element={<QuizAttemptPage />} />
          <Route path="/flashcards/review" element={<FlashcardReviewPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}