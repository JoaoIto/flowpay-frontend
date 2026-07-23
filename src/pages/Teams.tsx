import { useState, useEffect } from 'react';
import { getTeams, createTeam, type Team } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Server, Network } from 'lucide-react';

export function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<Team>({ name: '', type: 'CARTOES' });
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      toast.error('Erro ao carregar times');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeam(newTeam);
      toast.success('Time criado com sucesso!');
      setIsModalOpen(false);
      setNewTeam({ name: '', type: 'CARTOES' });
      fetchTeams();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha de conexão com o servidor';
      toast.error(`Erro ao criar time: ${message}`);
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Times e Filas</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie os departamentos de atendimento</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FFC700] hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md focus:ring-4 outline-none focus:ring-amber-400/20"
        >
          <Plus size={18} className="stroke-[3]" />
          Novo Time
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Carregando...</div>
        ) : teams.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
              <Network size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Nenhum time cadastrado</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">Crie seu primeiro departamento para começar a direcionar atendimentos.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Nome do Time</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Tipo (Roteamento)</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">ID Interno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teams.map(team => (
                <tr key={team.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                      <Server size={16} />
                    </div>
                    {team.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">
                      {team.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500 font-mono">{team.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Cadastrar Novo Time</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Nome do Time</label>
                <input 
                  required
                  type="text" 
                  value={newTeam.name}
                  onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                  placeholder="Ex: Célula de Retenção"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Tipo de Roteamento</label>
                <select 
                  value={newTeam.type}
                  onChange={e => setNewTeam({...newTeam, type: e.target.value as any})}
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                >
                  <option value="CARTOES">Cartões</option>
                  <option value="EMPRESTIMOS">Empréstimos</option>
                  <option value="OUTROS_ASSUNTOS">Outros Assuntos</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
