import api from './api';

export interface User {
  id: number;
  email: string;
  role: 'student' | 'counselor' | 'admin';
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'student' | 'counselor' | 'admin';
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

