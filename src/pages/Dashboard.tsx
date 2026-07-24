import { useState, useEffect, useRef } from 'react';
import { Users, Clock, CheckCircle2, XCircle, Activity, BarChart3, PieChart } from 'lucide-react';
import { dashboardSse } from '../services/sseClient';
import api from '../services/api';
import type { DashboardSnapshot } from '../types/dashboard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLogsStore } from '../store/logsStore';
import { 
  PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialMetrics: DashboardSnapshot = {
  timestamp: new Date().toISOString(),
  globalMetrics: {
    totalActiveChats: 0,
    totalQueuedChats: 0,
    totalAvailableAgents: 0,
    totalLoggedInAgents: 0,
    occupancyRatePercent: 0,
    averageWaitTimeSeconds: 0,
    slaCompliancePercent: 100,
    abandonRatePercent: 0
  },
  teamMetrics: []
};

// Component to flash green/red when a number changes
function AnimatedNumber({ value, prefix = "", suffix = "", formatter = (v: number) => (v ?? 0).toString() }: { value?: number, prefix?: string, suffix?: string, formatter?: (v: number) => string }) {
  const safeValue = value ?? 0;
  const [displayValue, setDisplayValue] = useState(safeValue);
  const [flashClass, setFlashClass] = useState("");
  const prevValue = useRef(safeValue);

  useEffect(() => {
    if (safeValue !== prevValue.current) {
      const isUp = safeValue > prevValue.current;
      setFlashClass(isUp ? "text-emerald-500 scale-110" : "text-rose-500 scale-95");
      setDisplayValue(safeValue);
      prevValue.current = safeValue;
      
      const timer = setTimeout(() => {
        setFlashClass("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [safeValue]);

  return (
    <span className={cn("inline-block transition-all duration-300 transform", flashClass)}>
      {prefix}{formatter(displayValue)}{suffix}
    </span>
  );
}

export function Dashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(initialMetrics);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'realtime'>('overview');

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setSnapshot(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDashboardData();

    // Subscribe to SSE for updates
    dashboardSse.connect(
      () => {
        // Whenever an event arrives (e.g. CHAT_QUEUED), refetch the dashboard
        fetchDashboardData();
      },
      (connected) => {
        setIsConnected(connected);
      }
    );

    return () => {
      dashboardSse.disconnect();
    };
  }, []);

  const { globalMetrics, teamMetrics } = snapshot;
  const isStressed = globalMetrics.occupancyRatePercent > 90;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Connection Status & Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Métricas Globais</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Atualizado em tempo real via Redis Pub/Sub</p>
        </div>
        
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-colors",
          isConnected 
            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" 
            : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
        )}>
          <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500 animate-pulse")}></span>
          {isConnected ? 'SSE Live' : 'Conectando SSE...'}
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={cn("px-4 py-3 font-medium text-sm transition-colors relative", activeTab === 'overview' ? "text-amber-500" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300")}
        >
          Visão Geral
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={cn("px-4 py-3 font-medium text-sm transition-colors relative", activeTab === 'analytics' ? "text-amber-500" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300")}
        >
          Analytics (IA & Demandas)
          {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('realtime')}
          className={cn("px-4 py-3 font-medium text-sm transition-colors relative flex items-center gap-2", activeTab === 'realtime' ? "text-amber-500" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300")}
        >
          Tempo Real
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          {activeTab === 'realtime' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Taxa de Ocupação" 
              value={<AnimatedNumber value={globalMetrics.occupancyRatePercent} suffix="%" formatter={(v) => v.toFixed(1)} />} 
              subtitle="Chats ativos vs Capacidade"
              icon={<Users className={isStressed ? "text-rose-500" : "text-amber-500"} />}
              alert={isStressed}
            />
            
            <MetricCard 
              title="TME (Tempo Médio)" 
              value={<AnimatedNumber value={globalMetrics.averageWaitTimeSeconds} suffix="s" formatter={(v) => v.toFixed(0)} />} 
              subtitle="Espera na fila"
              icon={<Clock className="text-amber-500" />}
            />
            
            <MetricCard 
              title="SLA Compliance" 
              value={<AnimatedNumber value={globalMetrics.slaCompliancePercent} suffix="%" formatter={(v) => v.toFixed(1)} />} 
              subtitle="Atendimentos dentro do prazo"
              icon={<CheckCircle2 className="text-emerald-500" />}
            />
            
            <MetricCard 
              title="Taxa de Abandono" 
              value={<AnimatedNumber value={globalMetrics.abandonRatePercent} suffix="%" formatter={(v) => v.toFixed(1)} />} 
              subtitle="Desistências na fila"
              icon={<XCircle className="text-rose-500" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Activity className="text-amber-500" size={20} />
                  Filas Departamentais
                </h2>
              </div>
              
              <div className="space-y-4">
                {teamMetrics.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    Nenhuma fila processada ainda.
                  </div>
                ) : (
                  teamMetrics.map((team) => (
                    <div key={team.teamId} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{team.teamName}</h3>
                        <div className="flex gap-4 mt-1">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{team.availableAgents}</span> / {team.totalAgents} agentes web
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            TME: <span className="font-medium text-slate-700 dark:text-slate-300">{team.averageWaitTimeSeconds.toFixed(0)}s</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Ativos</div>
                          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            <AnimatedNumber value={team.activeChats} />
                          </div>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="text-center">
                          <div className="text-sm text-amber-500 uppercase font-bold tracking-wider mb-1">Fila</div>
                          <div className="text-2xl font-black text-amber-500">
                            <AnimatedNumber value={team.queuedChats} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-100">Status Operacional</h2>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Capacidade da Operação</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      <AnimatedNumber value={globalMetrics.totalAvailableAgents} /> disponíveis
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", isStressed ? "bg-rose-500" : "bg-emerald-500")}
                      style={{ width: `${Math.min(globalMetrics.occupancyRatePercent, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Volume Global</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                        <AnimatedNumber value={globalMetrics.totalActiveChats} />
                      </div>
                      <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Ativos</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-center">
                      <div className="text-3xl font-black text-amber-600 dark:text-amber-500">
                        <AnimatedNumber value={globalMetrics.totalQueuedChats} />
                      </div>
                      <div className="text-xs uppercase font-bold text-amber-500 mt-1">Em Fila</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab teamMetrics={teamMetrics} />
      )}

      {activeTab === 'realtime' && (
        <RealtimeTab currentRequests={globalMetrics.totalActiveChats + globalMetrics.totalQueuedChats} />
      )}

      {/* Últimos Logs */}
      <RecentLogsCard />

    </div>
  );
}

function RecentLogsCard() {
  const { logs } = useLogsStore();
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Activity className="text-amber-500" size={20} />
          Últimos Logs da API
        </h2>
      </div>
      
      {recentLogs.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Nenhuma requisição recente.
        </div>
      ) : (
        <div className="space-y-3">
          {recentLogs.map((log: any) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                  log.type === 'INFO' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  log.type === 'SUCCESS' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  log.type === 'ERROR' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {log.type}
                </span>
                <div>
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    {log.method} <span className="text-slate-500 dark:text-slate-400">{log.url}</span>
                  </div>
                  {log.errorMessage && (
                    <div className="text-xs text-red-500 mt-1">{log.errorMessage}</div>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                {log.durationMs && <div>{log.durationMs}ms</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, alert = false }: any) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md duration-300",
      alert ? "border-rose-200 dark:border-rose-900/50" : "border-slate-100 dark:border-slate-800"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center border",
          alert ? "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50" : "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30"
        )}>
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-slate-600 dark:text-slate-400 font-medium text-sm mb-1">{title}</h3>
        <div className={cn("text-3xl font-extrabold tracking-tight", alert ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-100")}>
          {value}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}

const COLORS = ['#059669', '#d97706', '#2563eb', '#dc2626', '#7c3aed'];

function AnalyticsTab({ teamMetrics }: { teamMetrics: any[] }) {
  // Dados para o gráfico de pizza (Distribuição de Demandas por Time)
  const demandData = teamMetrics.map(team => ({
    name: team.teamName,
    value: team.activeChats + team.queuedChats
  })).filter(d => d.value > 0);

  // Dados para o gráfico de barras (TME por Time)
  const tmeData = teamMetrics.map(team => ({
    name: team.teamName,
    tme: team.averageWaitTimeSeconds
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <PieChart className="text-amber-500" size={20} />
            Distribuição de Demandas
          </h2>
        </div>
        
        {demandData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Sem dados suficientes
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={demandData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demandData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <BarChart3 className="text-amber-500" size={20} />
            TME por Departamento (Segundos)
          </h2>
        </div>
        
        {tmeData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Sem dados suficientes
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tmeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="tme" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function RealtimeTab({ currentRequests }: { currentRequests: number }) {
  const [filter, setFilter] = useState<'1h' | '6h' | '24h'>('1h');
  const [data, setData] = useState<any[]>([]);

  // Append real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const now = new Date();
        const formatOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
        if (filter === '1h') formatOptions.second = '2-digit'; // show seconds se 1h
        
        const newPoint = {
          time: now.toLocaleTimeString([], formatOptions),
          timestamp: now.getTime(),
          requests: currentRequests
        };
        
        // Define max points based on filter (interval is 5s)
        let maxPoints = 720; // 1h
        if (filter === '6h') maxPoints = 4320;
        else if (filter === '24h') maxPoints = 17280;

        const newData = [...prev, newPoint];
        if (newData.length > maxPoints) {
          return newData.slice(newData.length - maxPoints);
        }
        return newData;
      });
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [currentRequests, filter]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Activity className="text-amber-500 animate-pulse" size={20} />
              Monitoramento em Tempo Real
            </h2>
            <p className="text-sm text-slate-500 mt-1">Volume de requisições ativas + em fila no motor FlowPay</p>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('1h')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", filter === '1h' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700")}
            >
              Última Hora
            </button>
            <button 
              onClick={() => setFilter('6h')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", filter === '6h' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700")}
            >
              6 Horas
            </button>
            <button 
              onClick={() => setFilter('24h')}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", filter === '24h' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700")}
            >
              Diário
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => Math.floor(val).toString()}
              />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="requests" 
                name="Requisições no Motor"
                stroke="#f59e0b" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorReq)" 
                isAnimationActive={false} // Disable animation to prevent visual glitches on real-time append
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
