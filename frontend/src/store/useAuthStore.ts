import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/toast';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('bazaario_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('bazaario_access_token');
};

export const useAuthStore = create<AuthState>((set) => {
  const initialUser = getStoredUser();
  const initialToken = getStoredToken();

  return {
    user: initialUser,
    accessToken: initialToken,
    isAuthenticated: Boolean(initialToken && initialUser),
    role: initialUser?.role || 'customer',

    setAuth: (user, token) => {
      localStorage.setItem('bazaario_user', JSON.stringify(user));
      localStorage.setItem('bazaario_access_token', token);
      set({
        user,
        accessToken: token,
        isAuthenticated: true,
        role: user.role,
      });
      toast.success(`Welcome, ${user.name}!`, 'You have successfully signed in.');
    },

    setUser: (user) => {
      localStorage.setItem('bazaario_user', JSON.stringify(user));
      set({ user, role: user.role });
    },

    logout: () => {
      localStorage.removeItem('bazaario_user');
      localStorage.removeItem('bazaario_access_token');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        role: 'customer',
      });
      toast.info('Signed Out', 'You have been safely logged out.');
    },
  };
});
