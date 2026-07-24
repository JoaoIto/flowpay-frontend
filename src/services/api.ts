import axios from 'axios';
import { useLogsStore } from '../store/logsStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Config.metadata to store start time
  (config as any).metadata = { startTime: new Date().getTime() };
  
  useLogsStore.getState().addLog({
    timestamp: new Date().toISOString(),
    type: 'INFO',
    method: config.method?.toUpperCase() || 'UNKNOWN',
    url: config.url || '',
    requestPayload: typeof config.data === 'string' ? JSON.parse(config.data) : config.data
  });
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  const duration = new Date().getTime() - (response.config as any).metadata.startTime;
  
  useLogsStore.getState().addLog({
    timestamp: new Date().toISOString(),
    type: 'SUCCESS',
    method: response.config.method?.toUpperCase() || 'UNKNOWN',
    url: response.config.url || '',
    requestPayload: typeof response.config.data === 'string' ? JSON.parse(response.config.data) : response.config.data,
    responsePayload: response.data,
    statusCode: response.status,
    durationMs: duration
  });
  
  return response;
}, (error) => {
  const duration = error.config ? new Date().getTime() - (error.config as any).metadata.startTime : 0;
  
  const errorMessage = error.response?.data?.detail || error.message;
  
  useLogsStore.getState().addLog({
    timestamp: new Date().toISOString(),
    type: 'ERROR',
    method: error.config?.method?.toUpperCase() || 'UNKNOWN',
    url: error.config?.url || '',
    requestPayload: typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : error.config?.data,
    responsePayload: error.response?.data,
    statusCode: error.response?.status,
    errorMessage: errorMessage,
    durationMs: duration
  });

  // Global toast for errors
  toast.error(errorMessage);

  return Promise.reject(error);
});

// Teams API
export interface Team {
  id: string; // Keep interface with ID for frontend mapping
  name: string;
  type: string;
  createdAt: string;
}

export const getTeams = () => api.get<Team[]>('/teams').then(res => res.data);
export const createTeam = (data: { name: string; type: string }) => api.post<Team>('/teams', data).then(res => res.data);
export const updateTeam = (id: string, data: { name: string; type: string }) => api.put<Team>(`/teams/${id}`, data).then(res => res.data);
export const deleteTeam = (id: string) => api.delete(`/teams/${id}`).then(res => res.data);

// Agents API
export interface Agent {
  id: string;
  teamId: string;
  name: string;
  maxChats: number;
  activeChatsCount: number;
  status: 'AVAILABLE' | 'OFFLINE' | 'ON_BREAK';
}

export const getAgents = () => api.get<Agent[]>('/agents').then(res => res.data);
export const createAgent = (data: { name: string; teamId: string }) => api.post<Agent>('/agents', data).then(res => res.data);
export const updateAgent = (id: string, data: { name: string; maxChats?: number }) => api.put<Agent>(`/agents/${id}`, data).then(res => res.data);
export const deleteAgent = (id: string) => api.delete(`/agents/${id}`).then(res => res.data);

export const updateAgentStatus = async (id: string, status: string): Promise<void> => {
  await api.patch(`/agents/${id}/status`, { status });
};

// Simulator API
export const simulateChat = async (customerId: string, teamType: string, subject: string): Promise<void> => {
  await api.post('/chats', {
    customerId,
    teamType,
    channel: 'WHATSAPP',
    subject
  });
};

export const suggestResponse = async (message: string): Promise<string> => {
  const res = await api.post('/ai/suggest', { message });
  return res.data.suggestion;
};

export default api;
