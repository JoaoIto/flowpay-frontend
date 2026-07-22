export interface GlobalMetrics {
  totalActiveChats: number;
  totalQueuedChats: number;
  totalAvailableAgents: number;
  totalLoggedInAgents: number;
  occupancyRatePercent: number;
  averageWaitTimeSeconds: number;
  slaCompliancePercent: number;
  abandonRatePercent: number;
}

export interface TeamMetricsResult {
  teamId: string;
  teamName: string;
  activeChats: number;
  queuedChats: number;
  availableAgents: number;
  totalAgents: number;
  occupancyRatePercent: number;
  averageWaitTimeSeconds: number;
}

export interface DashboardSnapshot {
  timestamp: string;
  globalMetrics: GlobalMetrics;
  teamMetrics: TeamMetricsResult[];
}
