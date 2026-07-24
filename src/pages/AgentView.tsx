import { useState } from 'react';
import { suggestResponse } from '../services/api';
import toast from 'react-hot-toast';
import { MessageSquareText, Sparkles } from 'lucide-react';

export function AgentView() {
  const [message, setMessage] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSuggestion = async () => {
    if (!message) {
      toast.error('Digite uma mensagem do cliente primeiro');
      return;
    }

    try {
      setLoading(true);
      const generated = await suggestResponse(message);
      setSuggestion(generated);
      toast.success('Sugestão gerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar sugestão');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Área do Agente</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ferramentas de atendimento e IA Copilot</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquareText className="text-amber-500" />
          Simulador de Atendimento com Copilot
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Mensagem Recebida do Cliente
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cole aqui a mensagem do cliente..."
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerateSuggestion}
              disabled={loading}
              className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-800/50 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Sparkles size={18} />
              {loading ? 'Gerando...' : '✨ Gerar Sugestão de Resposta'}
            </button>
          </div>

          {suggestion && (
            <div className="mt-4 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10">
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <Sparkles size={16} />
                Sugestão da IA
              </h4>
              <p className="text-sm text-emerald-900 dark:text-emerald-100 whitespace-pre-wrap">
                {suggestion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
