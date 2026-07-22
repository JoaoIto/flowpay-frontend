import { ReactNode } from 'react';
import { LayoutDashboard, Users, MessageSquareText, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border flex flex-col transition-all">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageSquareText size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">FlowPay</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/agents" icon={<Users size={18} />} label="Agentes" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Configurações" />
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-semibold">AD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">admin@flowpay.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border z-10 sticky top-0">
          <h1 className="text-xl font-semibold tracking-tight">Visão Geral</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Online
            </span>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>

    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
        ${isActive 
          ? 'bg-primary/10 text-primary dark:text-emerald-400' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
      `}
    >
      {icon}
      {label}
    </NavLink>
  );
}
