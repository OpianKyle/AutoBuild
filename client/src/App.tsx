import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/lib/protected-route";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import InvestorPortal from "@/pages/investor-portal";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      {!user ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {user.role === "admin" ? (
            <Route path="/" component={Dashboard} />
          ) : user.role === "investor" ? (
            <Route path="/" component={InvestorPortal} />
          ) : (
            <Route path="/" component={Landing} />
          )}
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/portal" component={InvestorPortal} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;