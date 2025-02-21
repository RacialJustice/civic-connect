import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type SelectUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Session } from '@supabase/supabase-js';
import { useLocation } from "wouter";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const user = authData.user;
      if (!user) {
        throw new Error("No user data found");
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name,
        village: user.user_metadata.village,
        ward: user.user_metadata.ward,
        constituency: user.user_metadata.constituency,
        county: user.user_metadata.county,
        country: user.user_metadata.country || "Kenya",
        role: user.user_metadata.role || "citizen",
        emailVerified: user.email_confirmed_at !== null,
        profileComplete: user.user_metadata.profile_complete || false,
        registrationStep: user.user_metadata.registration_step || "location",
        password: "", // Required by schema but not used
        createdAt: new Date(user.created_at),
        interests: user.user_metadata.interests || [],
        verificationToken: null,
        verificationTokenExpiry: null,
        level: user.user_metadata.level || null
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      setLocation("/");
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
  const [, setLocation] = useLocation();

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
            profile_complete: false,
            registration_step: "location",
            interests: []
          },
        },
      });
      if (error) throw error;

      const user = data.user;
      if (!user) {
        throw new Error("Registration failed");
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name,
        village: user.user_metadata.village,
        ward: user.user_metadata.ward,
        constituency: user.user_metadata.constituency,
        county: user.user_metadata.county,
        country: user.user_metadata.country || "Kenya",
        role: user.user_metadata.role || "citizen",
        emailVerified: user.email_confirmed_at !== null,
        profileComplete: false,
        registrationStep: "location",
        password: "", // Required by schema but not used
        createdAt: new Date(user.created_at),
        interests: [],
        verificationToken: null,
        verificationTokenExpiry: null,
        level: null
      };
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      setLocation("/auth");
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
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      setLocation("/auth");
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthInitialized(true);
    });

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
    queryKey: ["/api/user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;

      const user = session.user;
      return {
        id: parseInt(user.id), // Convert string ID to number
        email: user.email!,
        name: user.user_metadata.name,
        village: user.user_metadata.village,
        ward: user.user_metadata.ward,
        constituency: user.user_metadata.constituency,
        county: user.user_metadata.county,
        country: user.user_metadata.country || "Kenya",
        role: user.user_metadata.role || "citizen",
        emailVerified: user.email_confirmed_at !== null,
        profileComplete: user.user_metadata.profile_complete || false,
        registrationStep: user.user_metadata.registration_step || "location",
        password: "", // Required by schema but not used
        createdAt: user.created_at ? new Date(user.created_at) : null,
        interests: user.user_metadata.interests || [],
        verificationToken: null,
        verificationTokenExpiry: null,
        level: user.user_metadata.level || null
      };
    },
    enabled: !!session?.user,
  });

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

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

  // Add debug logging
  useEffect(() => {
    if (context.user) {
      console.log("Auth - User ID:", context.user.id, "Type:", typeof context.user.id);
    }
  }, [context.user]);

  return context;
}