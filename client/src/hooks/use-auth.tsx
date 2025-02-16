import { createContext, useContext, ReactNode } from "react";

// Simplified context without auth
interface AuthContextType {
  user: null;
  loading: boolean;
  error: null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{
      user: null,
      loading: false,
      error: null
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}