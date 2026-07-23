import { create } from 'zustand';

export type LogType = 'INFO' | 'SUCCESS' | 'ERROR';

export interface ApiLog {
  id: string;
  timestamp: string;
  type: LogType;
  method: string;
  url: string;
  requestPayload?: any;
  responsePayload?: any;
  statusCode?: number;
  errorMessage?: string;
  durationMs?: number;
}

interface LogsStore {
  logs: ApiLog[];
  addLog: (log: Omit<ApiLog, 'id'>) => void;
  clearLogs: () => void;
}

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({
    logs: [
      {
        ...log,
        id: crypto.randomUUID(),
      },
      ...state.logs
    ].slice(0, 100) // Keep only last 100 logs
  })),
  clearLogs: () => set({ logs: [] }),
}));
