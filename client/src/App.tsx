import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ChatProvider } from "./hooks/use-chat";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import LeadersPage from "@/pages/leaders-page";
import ForumsPage from "@/pages/forums-page";
import { ProtectedRoute } from "./lib/protected-route";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';
import ProfilePage from "@/pages/profile-page";
import ForumPage from "./pages/forum-page";
import { ErrorBoundary } from "@/components/error-boundary";
import { Layout } from "./components/layout";
import EventsPage from "./pages/events-page";
import EventPage from "./pages/event-page";
import NotificationsPage from "@/pages/notifications-page"; // Import the new component

function Router() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <Layout>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/leaders" component={LeadersPage} />
          <Route path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/forums" component={ForumsPage} />
          <Route path="/forums/:id" component={ForumPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/events/:id" component={EventPage} />
          <Route path="/notifications">
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <ChatProvider>
            <Router />
            <Toaster />
          </ChatProvider>
        </AuthProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;