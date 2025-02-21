import { Routes, Route } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ChatProvider } from "./hooks/use-chat";
import { ThemeProvider } from "./hooks/use-theme";
import { ProtectedRoute } from "./lib/protected-route";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "./components/layout";
import i18n from './lib/i18n';
import { I18nextProvider } from 'react-i18next';
import { Suspense, lazy } from 'react';
import { Loader } from '@/components/ui/loader';
import { DrawerProvider } from './components/DrawerContext';
import { Budget } from './components/Budget';
import { BudgetDetail } from './components/BudgetDetail';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home-page'));
const AuthPage = lazy(() => import('@/pages/auth-page'));
const ProfilePage = lazy(() => import('@/pages/profile-page'));
const LeadersPage = lazy(() => import('@/pages/leaders-page/index'));
const ForumsPage = lazy(() => import('@/pages/forums-page'));
const EventsPage = lazy(() => import('@/pages/events-page')); // Update this line
const DocumentsPage = lazy(() => import('@/pages/documents'));
const CalendarPage = lazy(() => import('@/pages/calendar'));
const ProfileDashboard = lazy(() => import('@/pages/profile/dashboard'));
const LocalUpdatesPage = lazy(() => import('@/pages/local-updates'));
const ReportsPage = lazy(() => import('@/pages/reports'));
const ProjectsPage = lazy(() => import('@/pages/projects'));
const EmergencyContactsPage = lazy(() => import('@/pages/emergency-contacts'));
const EmergencyAlertPage = lazy(() => import('@/pages/emergency-alert'));
const Polls = lazy(() => import('@/pages/Polls'));
const ProfileOverview = lazy(() => import('@/pages/profile/overview'));
const SettingsPage = lazy(() => import('@/pages/profile/settings'));
const SecurityPage = lazy(() => import('@/pages/profile/security'));
const EmergencyServicesPage = lazy(() => import('@/pages/emergency-services'));
const CreateEventPage = lazy(() => import('@/pages/create-event'));
const ForumPage = lazy(() => import('@/pages/forum-page'));
const NotificationsPage = lazy(() => import('@/pages/profile/notifications-page'));
const EventPage = lazy(() => import('@/pages/event-page'));
const BudgetManagement = lazy(() => import('@/pages/admin/budget-management'));

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background font-sans antialiased">
        <I18nextProvider i18n={i18n}>
          <ThemeProvider defaultTheme="system" storageKey="kenya-civic-theme">
            <QueryClientProvider client={queryClient}>
              <SessionContextProvider supabaseClient={supabase}>
                <AuthProvider>
                  <ChatProvider>
                    <DrawerProvider>
                      <Layout>
                        <div className="flex-1 w-full">
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
                              <Route index element={
                                <Suspense fallback={<Loader />}>
                                  <ProfileOverview />
                                </Suspense>
                              } />
                              <Route path="dashboard" element={
                                <Suspense fallback={<Loader />}>
                                  <ProfileDashboard />
                                </Suspense>
                              } />
                              <Route path="notifications" element={
                                <Suspense fallback={<Loader />}>
                                  <NotificationsPage />
                                </Suspense>
                              } />
                              <Route path="settings" element={
                                <Suspense fallback={<Loader />}>
                                  <SettingsPage />
                                </Suspense>
                              } />
                              <Route path="security" element={
                                <Suspense fallback={<Loader />}>
                                  <SecurityPage />
                                </Suspense>
                              } />
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
                            <Route path="/emergency-services" element={
                              <ProtectedRoute>
                                <Suspense fallback={<Loader />}>
                                  <EmergencyServicesPage />
                                </Suspense>
                              </ProtectedRoute>
                            } />
                            <Route path="/budgets" element={<Budget />} />
                            <Route path="/budgets/:id" element={<BudgetDetail />} />
                            <Route 
                              path="/admin/budgets" 
                              element={
                                <ProtectedRoute adminOnly>
                                  <Suspense fallback={<Loader />}>
                                    <BudgetManagement />
                                  </Suspense>
                                </ProtectedRoute>
                              } 
                            />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                      </Layout>
                    </DrawerProvider>
                    <Toaster />
                  </ChatProvider>
                </AuthProvider>
              </SessionContextProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </I18nextProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;