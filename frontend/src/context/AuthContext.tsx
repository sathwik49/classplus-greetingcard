import { createContext, useContext, useEffect, useRef, useState } from "react";

import { axiosClient } from "../api/axios";
import { endPoints } from "../api/endPoints";

import type { CurrentUserResponseType } from "../api/types";

type User = {
  id: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
  plan: "free" | "premium";
  isVerified: boolean;
};

type AuthContextType = {
  accessToken: string | null;

  user: User | null;

  isAuthLoading: boolean;

  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const restoreSession = async () => {
      try {
        const refreshResponse = await axiosClient.post(endPoints.AUTH.REFRESH);

        const token = refreshResponse.data.details.accessToken;

        setAccessToken(token);

        const meResponse = await axiosClient.get<CurrentUserResponseType>(
          endPoints.USER.ME,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(meResponse.data.details);
      } catch (error) {
        setAccessToken(null);

        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
