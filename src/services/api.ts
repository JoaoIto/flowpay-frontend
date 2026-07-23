import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Teams API
export interface Team {
  id?: string;
  name: string;
  type: 'CARTOES' | 'EMPRESTIMOS' | 'OUTROS_ASSUNTOS';
}

export const getTeams = async (): Promise<Team[]> => {
  const { data } = await api.get('/teams');
  return data;
};

export const createTeam = async (team: Team): Promise<Team> => {
  const { data } = await api.post('/teams', team);
  return data;
};

// Agents API
export interface Agent {
  id?: string;
  name: string;
  teamId: string;
  status?: 'AVAILABLE' | 'ON_BREAK' | 'OFFLINE' | 'BUSY';
  activeChatsCount?: number;
  maxChats?: number;
}

export const getAgents = async (): Promise<Agent[]> => {
  const { data } = await api.get('/agents');
  return data;
};

export const createAgent = async (agent: { name: string; teamId: string }): Promise<Agent> => {
  const { data } = await api.post('/agents', agent);
  return data;
};

export const updateAgentStatus = async (id: string, status: string): Promise<void> => {
  await api.patch(`/agents/${id}/status?status=${status}`);
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

export default api;
