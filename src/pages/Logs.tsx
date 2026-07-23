import { useState } from 'react';
import { useLogsStore } from '../store/logsStore';
import { Terminal, X, Code } from 'lucide-react';
import { clsx } from 'clsx';

export function Logs() {
  const { logs, clearLogs } = useLogsStore();
  const [selectedLog, setSelectedLog] = useState<any>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Logs do Sistema</h1>
          <p className="text-slate-600 dark:text-slate-400">Histórico de requisições e respostas da API em tempo real.</p>
        </div>
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
        >
          Limpar Logs
        </button>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-slate-200/80 dark:border-[#1C2438] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200/80 dark:border-[#1C2438]">
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Tempo</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Tipo</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Método</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">URL</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Status</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400">Duração</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600 dark:text-slate-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    Nenhum log registrado.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="border-b border-slate-100 dark:border-[#1C2438] hover:bg-slate-50/50 dark:hover:bg-[#0B0F19]/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={clsx(
                        "px-2 py-1 rounded text-xs font-medium",
                        log.type === 'INFO' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        log.type === 'SUCCESS' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        log.type === 'ERROR' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-700 dark:text-slate-300">
                      {log.method}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={log.url}>
                      {log.url}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {log.statusCode || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {log.durationMs ? `${log.durationMs}ms` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
                        title="Ver Detalhes"
                      >
                        <Code size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-[#1C2438]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1C2438]">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal size={20} className="text-amber-500" />
                Detalhes do Log
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">URL</span>
                  <div className="bg-slate-50 dark:bg-[#0B0F19] p-2 rounded border border-slate-200 dark:border-[#1C2438] text-slate-800 dark:text-slate-200 break-all">
                    {selectedLog.method} {selectedLog.url}
                  </div>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Status</span>
                  <div className="bg-slate-50 dark:bg-[#0B0F19] p-2 rounded border border-slate-200 dark:border-[#1C2438] text-slate-800 dark:text-slate-200">
                    {selectedLog.statusCode || 'N/A'} {selectedLog.errorMessage && ` - ${selectedLog.errorMessage}`}
                  </div>
                </div>
              </div>

              {selectedLog.requestPayload && (
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Payload Enviado (Request)</span>
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {JSON.stringify(selectedLog.requestPayload, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.responsePayload && (
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Payload Recebido (Response)</span>
                  <pre className="bg-slate-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {JSON.stringify(selectedLog.responsePayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
