import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

export interface User {
  id: number;
  email: string;
  fullName: string;
  plan: 'small_bite' | 'big_bite' | 'shared_bite';
}

export interface Profile {
  id?: number;
  display_name?: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  dietary_preference?: string;
  allergies?: string[];
  fitness_goal?: string;
  calorie_target?: number;
  protein_target?: number;
  carb_target?: number;
  fat_target?: number;
  fiber_target?: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (token: string, userData: User, profileData?: Profile) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUserPlan: (plan: 'small_bite' | 'big_bite' | 'shared_bite') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      if (res.success) {
        setUser({
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.full_name,
          plan: res.user.plan
        });
        setProfile(res.profile);
      } else {
        removeAuthToken();
      }
    } catch (err) {
      console.warn('Session expired or error loading profile:', err);
      removeAuthToken();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token: string, userData: User, profileData?: Profile) => {
    setAuthToken(token);
    setUser(userData);
    if (profileData) setProfile(profileData);
    else fetchCurrentUser();
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  const updateUserPlan = (plan: 'small_bite' | 'big_bite' | 'shared_bite') => {
    if (user) {
      setUser({ ...user, plan });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        refreshProfile,
        updateUserPlan
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
