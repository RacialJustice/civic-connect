import { Switch, Route } from "wouter";
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;