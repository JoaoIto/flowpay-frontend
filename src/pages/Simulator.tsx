import { useState } from 'react';
import { simulateChat } from '../services/api';
import toast from 'react-hot-toast';
import { MessageSquareText, Send, Info, Smartphone } from 'lucide-react';

export function Simulator() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '+5511999999999',
    subject: 'Gostaria de falar sobre meu cartão'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.subject) return;

    try {
      setLoading(true);
      // O backend roteia baseado em regras do subject: "cartão", "empréstimo"
      let teamType = 'OUTROS_ASSUNTOS';
      const lowerSubject = formData.subject.toLowerCase();
      if (lowerSubject.includes('cartao') || lowerSubject.includes('cartão')) {
        teamType = 'CARTOES';
      } else if (lowerSubject.includes('emprestimo') || lowerSubject.includes('empréstimo')) {
        teamType = 'EMPRESTIMOS';
      }

      await simulateChat(formData.customerId, teamType, formData.subject);
      toast.success('Chat simulado enviado com sucesso!');
      
      // Resetar assunto para facilitar novo teste
      setFormData(prev => ({ ...prev, subject: '' }));
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha de conexão com o servidor';
      toast.error(`Erro ao simular chat: ${message}`);
      console.error(error);
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

              <div className="flex items-center justify-end pt-4">
                <button 
                  disabled={loading}
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {loading ? 'Processando...' : 'Injetar no Motor de Roteamento'}
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
    </div>
  );
}
