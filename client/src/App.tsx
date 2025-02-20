import { Routes, Route, Outlet } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ChatProvider } from "./hooks/use-chat";
import { ThemeProvider } from "./hooks/use-theme";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/profile/dashboard";
import LeadersPage from "@/pages/leaders-page";
import ForumsPage from "@/pages/forums-page";
import { ProtectedRoute } from "./lib/protected-route";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import ProfilePage from "@/pages/profile-page";
import ForumPage from "./pages/forum-page";
import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "./components/layout";
import EventsPage from "./pages/events-page";
import EventPage from "./pages/event-page";
import NotificationsPage from "@/pages/profile/notifications-page";
import i18n from './lib/i18n';
import { I18nextProvider } from 'react-i18next';
import CreateEventPage from "@/pages/create-event";
import CalendarPage from './pages/calendar';
import DocumentsPage from './pages/documents';
import LocalUpdatesPage from './pages/local-updates';
import ReportsPage from './pages/reports';
import ProjectsPage from './pages/projects';
import EmergencyContactsPage from './pages/emergency-contacts';
import EmergencyAlertPage from './pages/emergency-alert';
import Polls from "@/pages/Polls"; // Or "@/pages/polls" if using index.tsx
import { Suspense } from 'react';
import { Loader } from '@/components/ui/loader';
import ProfileOverview from "@/pages/profile/overview";
import SettingsPage from "@/pages/profile/settings";
import SecurityPage from "@/pages/profile/security";

function App() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="system" storageKey="kenya-civic-theme">
          <QueryClientProvider client={queryClient}>
            <SessionContextProvider supabaseClient={supabase}>
              <AuthProvider>
                <ChatProvider>
                  <Layout>
                    <Routes>
                      <Route path="/auth" element={
                        <Suspense fallback={<Loader />}>
                          <AuthPage />
                        </Suspense>
                      } />
                      <Route path="/" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <HomePage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <ProfilePage />
                          </Suspense>
                        </ProtectedRoute>
                      }>
                        <Route index element={<ProfileOverview />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="security" element={<SecurityPage />} />
                      </Route>
                      <Route path="/leaders" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <LeadersPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/forums" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <ForumsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/forums/:id" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <ForumPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/events" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <EventsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/events/create" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <CreateEventPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/events/:id" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <EventPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/notifications" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <NotificationsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/documents" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <DocumentsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/calendar" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <CalendarPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/reports" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <ReportsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/local-updates" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <LocalUpdatesPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/projects" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <ProjectsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/emergency-contacts" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <EmergencyContactsPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/emergency-alert" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <EmergencyAlertPage />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="/polls" element={
                        <ProtectedRoute>
                          <Suspense fallback={<Loader />}>
                            <Polls />
                          </Suspense>
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                  <Toaster />
                </ChatProvider>
              </AuthProvider>
            </SessionContextProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;