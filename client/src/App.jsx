import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const ProfileWizardPage = lazy(() => import('@/pages/ProfileWizardPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AIMentorPage = lazy(() => import('@/pages/AIMentorPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'));
const LearningPage = lazy(() => import('@/pages/LearningPage'));
const OpportunitiesPage = lazy(() => import('@/pages/OpportunitiesPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const MotivationPage = lazy(() => import('@/pages/MotivationPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/profile-wizard" element={<ProtectedRoute><ProfileWizardPage /></ProtectedRoute>} />

            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="ai-mentor" element={<AIMentorPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="opportunities" element={<OpportunitiesPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="motivation" element={<MotivationPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/:id" element={<ProfilePage />} />
              <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}
