import { create } from 'zustand';
import { authAPI, issueAPI } from '../services/api';

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority?: 'Low' | 'Medium' | 'High';
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface IssueState {
  issues: Issue[];
  selectedIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  filterStatus: string;
  filterPriority: string;
  
  fetchIssues: (page?: number) => Promise<void>;
  fetchIssueById: (id: string) => Promise<void>;
  createIssue: (data: Omit<Issue, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIssue: (id: string, data: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  updateIssueStatus: (id: string, status: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterPriority: (priority: string) => void;
  clearFilters: () => void;
  exportToCSV: () => Promise<void>;
  exportToJSON: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  })(),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.register({ email, password, name });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  selectedIssue: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  searchQuery: '',
  filterStatus: '',
  filterPriority: '',

  fetchIssues: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const { data } = await issueAPI.getAll({
        page,
        limit: state.pageSize,
        status: state.filterStatus || undefined,
        priority: state.filterPriority || undefined,
        search: state.searchQuery || undefined,
      });
      set({
        issues: data.issues,
        totalCount: data.totalCount,
        currentPage: page,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to fetch issues',
        isLoading: false,
      });
    }
  },

  fetchIssueById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await issueAPI.getById(id);
      set({
        selectedIssue: data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to fetch issue',
        isLoading: false,
      });
    }
  },

  createIssue: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await issueAPI.create(data as any);
      const state = get();
      await state.fetchIssues(1);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to create issue',
        isLoading: false,
      });
      throw err;
    }
  },

  updateIssue: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      await issueAPI.update(id, data);
      const state = get();
      await state.fetchIssues(state.currentPage);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to update issue',
        isLoading: false,
      });
      throw err;
    }
  },

  deleteIssue: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await issueAPI.delete(id);
      const state = get();
      await state.fetchIssues(state.currentPage);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to delete issue',
        isLoading: false,
      });
      throw err;
    }
  },

  updateIssueStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      await issueAPI.updateStatus(id, status);
      const state = get();
      // Update the selected issue with new status
      await state.fetchIssueById(id);
      // Also refresh the issues list
      await state.fetchIssues(state.currentPage);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to update issue status',
        isLoading: false,
      });
      throw err;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  setFilterStatus: (status: string) => {
    set({ filterStatus: status, currentPage: 1 });
  },

  setFilterPriority: (priority: string) => {
    set({ filterPriority: priority, currentPage: 1 });
  },

  clearFilters: () => {
    set({ searchQuery: '', filterStatus: '', filterPriority: '', currentPage: 1 });
  },

  exportToCSV: async () => {
    try {
      const { data } = await issueAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issues-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to export to CSV',
      });
      throw err;
    }
  },

  exportToJSON: async () => {
    try {
      const { data } = await issueAPI.exportJSON();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issues-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to export to JSON',
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
