import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl?: string;
  platform: 'threads' | 'twitter' | 'linkedin' | 'substack' | 'custom';
  bio?: string;
  joinedAt: string;
  isVerifiedWriter?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, handle?: string) => void;
  register: (name: string, handle: string, email: string, platform?: UserProfile['platform']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'claimtrace_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
    // Default logged in user for demo convenience if desired, or null
    return {
      id: 'usr-101',
      name: 'Ahmad Ramadhan',
      handle: '@ahmadramadannesia',
      email: 'ahmad@claimtrace.io',
      platform: 'threads',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      joinedAt: '2026-01-15',
      isVerifiedWriter: true,
      bio: 'Social media researcher & tech writer interested in epistemic attribution.',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, name?: string, handle?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const derivedName = name || cleanEmail.split('@')[0] || 'Writer';
    const derivedHandle = handle || `@${derivedName.toLowerCase().replace(/\s+/g, '')}`;

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: derivedName,
      handle: derivedHandle,
      email: cleanEmail,
      platform: 'threads',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${derivedHandle}`,
      joinedAt: new Date().toISOString().split('T')[0],
      isVerifiedWriter: true,
    };
    setUser(newUser);
  };

  const register = (
    name: string,
    handle: string,
    email: string,
    platform: UserProfile['platform'] = 'threads'
  ) => {
    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      handle: formattedHandle.trim(),
      email: email.trim().toLowerCase(),
      platform,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${formattedHandle}`,
      joinedAt: new Date().toISOString().split('T')[0],
      isVerifiedWriter: true,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
