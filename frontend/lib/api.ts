const API_BASE_URL = 'http://localhost:5000/api'; // Temporarily hardcoded

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Habit {
  _id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  progress: number;
  streak: number;
  completed: boolean;
  lastCompleted?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('Making authenticated request to:', url, 'with token:', this.token);
    } else {
      console.log('Making unauthenticated request to:', url);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  // Habit endpoints
  async getHabits(): Promise<Habit[]> {
    return this.request('/habits');
  }

  async getHabit(id: string): Promise<Habit> {
    return this.request(`/habits/${id}`);
  }

  async createHabit(name: string, frequency: 'daily' | 'weekly'): Promise<Habit> {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify({ name, frequency }),
    });
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    return this.request(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async toggleHabit(id: string): Promise<Habit> {
    return this.request(`/habits/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async undoHabitCompletion(id: string): Promise<Habit> {
    return this.request(`/habits/${id}/undo`, {
      method: 'PATCH',
    });
  }

  async deleteHabit(id: string): Promise<void> {
    return this.request(`/habits/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
