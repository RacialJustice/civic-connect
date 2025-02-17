import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Session } from '@supabase/supabase-js';

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  village?: string | null;
  ward?: string | null;
  constituency?: string | null;
  county?: string | null;
  country: string;
  role: string;
  emailVerified: boolean;
  profileComplete: boolean;
  registrationStep: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const userData = authData.user?.user_metadata;

      if (!userData) {
        throw new Error("No user data found");
      }

      return {
        id: authData.user.id,
        email: authData.user.email!,
        name: userData.name,
        village: userData.village,
        ward: userData.ward,
        constituency: userData.constituency,
        county: userData.county,
        country: userData.country || "Kenya",
        role: userData.role || "citizen",
        emailVerified: authData.user.email_confirmed_at !== null,
        profileComplete: false,
        registrationStep: "location",
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useRegisterMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (userData: any) => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "citizen",
            village: userData.village,
            ward: userData.ward,
            constituency: userData.constituency,
            county: userData.county,
            country: userData.country || "Kenya",
          },
        },
      });
      if (error) throw error;

      if (!data.user) {
        throw new Error("Registration failed");
      }

      return {
        id: data.user.id,
        ...data.user.user_metadata,
        email: data.user.email!,
        emailVerified: data.user.email_confirmed_at !== null,
        profileComplete: false,
        registrationStep: "location",
      };
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useLogoutMutation() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;

      // Return user data from session
      return {
        id: session.user.id,
        email: session.user.email!,
        ...session.user.user_metadata,
        emailVerified: session.user.email_confirmed_at !== null,
        profileComplete: false,
        registrationStep: "location",
      };
    },
    enabled: !!session?.user,
  });

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // Show loading state until auth is initialized
  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}