import { useState } from 'react';
import { simulateChat } from '../services/api';
import toast from 'react-hot-toast';
import { MessageSquareText, Send, Info, Smartphone } from 'lucide-react';

export function Simulator() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{customerId: string, subject: string, teamType: string, timestamp: string}[]>([]);
  const [formData, setFormData] = useState({
    customerId: '+5511999999999',
    subject: 'Gostaria de falar sobre meu cartão'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.subject) return;

    try {
      setLoading(true);
      await simulateChat(formData.customerId, 'OUTROS_ASSUNTOS', formData.subject);
      toast.success('Chat simulado enviado com sucesso!');
      
      setHistory(prev => [{
        customerId: formData.customerId,
        subject: formData.subject,
        teamType: 'IA_DECIDE',
        timestamp: new Date().toISOString()
      }, ...prev]);

      setFormData(prev => ({ ...prev, subject: '' }));
    } catch (error: any) {
      toast.error('Erro ao simular chat');
    } finally {
      setLoading(false);
    }
  };

  const handleStressTest = async () => {
    try {
      setLoading(true);
      toast.loading('Iniciando Teste de Estresse (20 reqs)...', { id: 'stress' });
      
      const subjects = [
        "meu cartão de crédito não funciona",
        "preciso de um empréstimo urgente",
        "quero investir na bolsa",
        "cadê a porcaria da minha fatura?",
        "falar com atendente agora",
        "quero cancelar minha conta",
        "esqueci a senha",
        "como peço um cartão novo?",
        "humano por favor",
        "taxa do financiamento tá muito alta"
      ];

      const promises = Array.from({ length: 20 }).map((_, i) => {
        const phone = `+551199999${String(i).padStart(4, '0')}`;
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        return simulateChat(phone, 'OUTROS_ASSUNTOS', randomSubject);
      });

      await Promise.all(promises);
      toast.success('Teste de estresse concluído com sucesso!', { id: 'stress' });
    } catch (error) {
      toast.error('Erro no teste de estresse', { id: 'stress' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Simulador de Roteamento</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Envie chats artificiais para testar o motor e a capacidade das filas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
              <MessageSquareText size={20} className="text-amber-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Nova Interação</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">ID do Cliente (Telefone)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone size={18} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <input 
                    required
                    type="text" 
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: e.target.value})}
                    className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Mensagem do Cliente</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="Ex: Preciso de ajuda com meu cartão de crédito"
                  className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 resize-none shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <button 
                  type="button"
                  onClick={handleStressTest}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <MessageSquareText size={18} />
                  Teste de Estresse (20 req)
                </button>
                <button 
                  disabled={loading}
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {loading ? 'Processando...' : 'Injetar 1 Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
              <Info size={18} className="text-amber-500" />
              Regras do Motor
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              O backend intercepta a mensagem e define o time de destino automaticamente baseado em palavras-chave:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="font-bold text-slate-900 dark:text-slate-100">Cartões:</strong> Use palavras como "cartão", "credito", "fatura".
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="font-bold text-slate-900 dark:text-slate-100">Empréstimos:</strong> Use palavras como "empréstimo", "financiamento".
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="font-bold text-slate-900 dark:text-slate-100">Outros Assuntos:</strong> Qualquer outra palavra cai no fallback.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <MessageSquareText className="text-amber-500" size={20} />
            Histórico de Simulações Recentes
          </h2>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            Nenhuma simulação realizada nesta sessão.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((sim, index) => (
              <div key={index} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Cliente: {sim.customerId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                      Roteado para: {sim.teamType}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(sim.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 italic">
                  "{sim.subject}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
