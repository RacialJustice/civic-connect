import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import OfficialDirectory from "./pages/official-directory";
import EducationalResources from "./pages/educational-resources";
import ForumsPage from "./pages/forums-page";
import ForumViewPage from "./pages/forum-view";
import AdminDashboard from "./pages/admin/dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import { QuickHelp } from "./components/quick-help";
import Navbar from "./components/layout/navbar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/officials" component={OfficialDirectory} />
        <ProtectedRoute path="/resources" component={EducationalResources} />
        <ProtectedRoute path="/forums" component={ForumsPage} />
        <ProtectedRoute path="/forums/:id" component={ForumViewPage} />
        <ProtectedRoute path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      <QuickHelp />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;