import { Switch, Route } from "wouter";
<<<<<<< HEAD
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
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/leaders" component={LeadersPage} />
      <Route component={NotFound} />
    </Switch>
=======
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";

import Navbar from "./components/layout/navbar";
import { QuickHelp } from "./components/quick-help";
import HomePage from "./pages/home-page";
import OfficialDirectory from "./pages/official-directory";
import EducationalResources from "./pages/educational-resources";
import ForumsPage from "./pages/forums-page";
import ForumViewPage from "./pages/forum-view";
import AdminDashboard from "./pages/admin/dashboard";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/officials" component={OfficialDirectory} />
        <Route path="/resources" component={EducationalResources} />
        <Route path="/forums" component={ForumsPage} />
        <Route path="/forums/:id" component={ForumViewPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      <QuickHelp />
    </div>
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
      <AuthProvider>
        <ChatProvider>
          <Router />
          <Toaster />
        </ChatProvider>
      </AuthProvider>
=======
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
>>>>>>> 19c724b7c93c94c7ada61db7cb86557d7bdca27b
    </QueryClientProvider>
  );
}

export default App;