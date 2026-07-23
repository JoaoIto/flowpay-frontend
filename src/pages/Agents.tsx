import { useState, useEffect } from 'react';
import { getAgents, createAgent, updateAgent, deleteAgent, updateAgentStatus, getTeams, type Agent, type Team } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, UserCircle, RefreshCcw, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentAgent, setCurrentAgent] = useState<Agent>({ id: '', name: '', teamId: '', status: 'AVAILABLE', activeChatsCount: 0, maxChats: 3 });
  const [newAgent, setNewAgent] = useState({ name: '', teamId: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [agentsData, teamsData] = await Promise.all([getAgents(), getTeams()]);
      setAgents(agentsData);
      setTeams(teamsData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.teamId) {
      toast.error('Selecione um time');
      return;
    }
    try {
      await createAgent(newAgent);
      toast.success('Agente cadastrado com sucesso!');
      setIsCreateModalOpen(false);
      setNewAgent({ name: '', teamId: '' });
      fetchData();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAgent(currentAgent.id!, { name: currentAgent.name, maxChats: currentAgent.maxChats });
      toast.success('Agente atualizado com sucesso!');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAgent(currentAgent.id!);
      toast.success('Agente excluído com sucesso!');
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (agent: Agent) => {
    try {
      const newStatus = agent.status === 'AVAILABLE' ? 'ON_BREAK' : 'AVAILABLE';
      await updateAgentStatus(agent.id!, newStatus);
      toast.success(`Status atualizado para ${newStatus}`);
      fetchData();
    } catch (error: any) {
      console.error(error);
    }
  };

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || id;

  const getStatusVisuals = (status?: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'ON_BREAK': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'BUSY': return 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const openEditModal = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Gestão de Agentes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Controle de acesso e capacidade da operação</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#FFC700] hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md focus:ring-4 outline-none focus:ring-amber-400/20"
        >
          <Plus size={18} className="stroke-[3]" />
          Novo Agente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500 dark:text-slate-400">Carregando...</div>
        ) : agents.length === 0 ? (
          <div className="col-span-full p-12 text-center flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300">
            <UserCircle size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Nenhum agente cadastrado</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">Adicione membros da equipe para que eles possam receber atendimentos.</p>
          </div>
        ) : (
          agents.map(agent => (
            <div key={agent.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{agent.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{getTeamName(agent.teamId)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", getStatusVisuals(agent.status))}>
                    {agent.status}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal(agent)}
                      className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(agent)}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Capacidade</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {agent.activeChatsCount || 0} / {agent.maxChats || 3}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all", 
                        (agent.activeChatsCount || 0) >= (agent.maxChats || 3) ? "bg-rose-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(((agent.activeChatsCount || 0) / (agent.maxChats || 3)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => handleToggleStatus(agent)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <RefreshCcw size={14} />
                    Alterar Status
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Cadastrar Novo Agente</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Nome do Agente</label>
                <input 
                  required
                  type="text" 
                  value={newAgent.name}
                  onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Time Associado</label>
                <select 
                  required
                  value={newAgent.teamId}
                  onChange={e => setNewAgent({...newAgent, teamId: e.target.value})}
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                >
                  <option value="" disabled>Selecione um time...</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-all"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Editar Agente</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Nome do Agente</label>
                <input 
                  required
                  type="text" 
                  value={currentAgent.name}
                  onChange={e => setCurrentAgent({...currentAgent, name: e.target.value})}
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Capacidade Máxima (Chats)</label>
                <input 
                  required
                  type="number"
                  min="1"
                  max="10"
                  value={currentAgent.maxChats}
                  onChange={e => setCurrentAgent({...currentAgent, maxChats: parseInt(e.target.value, 10)})}
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-md transition-all"
                >
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-rose-600 dark:text-rose-500">Excluir Agente</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-slate-600 dark:text-slate-400">
                Tem certeza que deseja excluir o agente <strong className="text-slate-900 dark:text-slate-100">{currentAgent.name}</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md transition-all"
                >
                  Excluir Agente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
