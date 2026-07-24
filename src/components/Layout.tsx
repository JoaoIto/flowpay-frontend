import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { LayoutDashboard, Users, MessageSquareText, Moon, Sun, Activity } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

interface LayoutProps {
  children?: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Times e Filas', href: '/teams', icon: Users },
  { name: 'Agentes', href: '/agents', icon: Users },
  { name: 'Área do Agente', href: '/agent-view', icon: MessageSquareText },
  { name: 'Simulador', href: '/simulator', icon: Activity },
  { name: 'Logs do Sistema', href: '/logs', icon: Activity },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F19] flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F2EDE1] dark:bg-[#0B0F19] border-r border-[#E6DEC8] dark:border-[#1C2438] flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-[#E6DEC8] dark:border-[#1C2438]">
          <div className="flex items-center gap-2 text-amber-500">
            <MessageSquareText size={24} className="stroke-[2.5]" />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">FlowPay</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-amber-400/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <Icon size={20} className={isActive ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-[#0B0F19] border-b border-slate-200/80 dark:border-[#1C2438] flex items-center px-8 justify-between shadow-sm transition-colors duration-300">
          <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100">Visão Geral</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Alternar Tema"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-800/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistema Online
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet />
          {children}
        </div>
      </main>
    </div>
  );
}
