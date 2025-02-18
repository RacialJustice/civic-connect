import { Switch, Route, useLocation } from "wouter";
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
import NotificationsPage from "@/pages/notifications-page";
import i18n from './lib/i18n';
import { I18nextProvider } from 'react-i18next';
import CreateEventPage from "@/pages/create-event";

function Router() {
  return (
    <ErrorBoundary>
      <Layout>
        <Switch>
          <Route path="/auth"><AuthPage /></Route>
          <Route path="/"><ProtectedRoute component={HomePage} /></Route>
          <Route path="/leaders"><ProtectedRoute component={LeadersPage} /></Route>
          <Route path="/profile"><ProfilePage /></Route>
          <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
          <Route path="/forums"><ForumsPage /></Route>
          <Route path="/forums/:id">
            {(params) => <ForumPage forumId={params.id} />}
          </Route>
          <Route path="/events/create"><CreateEventPage /></Route>
          <Route path="/events/:id">
            {(params) => <EventPage eventId={params.id} />}
          </Route>
          <Route path="/events"><EventsPage /></Route>
          <Route path="/notifications">
            <ProtectedRoute component={NotificationsPage} />
          </Route>
          <Route><NotFound /></Route>
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}

export default App;