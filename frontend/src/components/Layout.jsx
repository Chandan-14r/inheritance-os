import { Outlet, NavLink } from 'react-router-dom';
import { Home, Wallet, Users, Mail, TrendingUp, Clock, GitBranch } from 'lucide-react';

export default function Layout() {
  const items = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/dashboard/assets', icon: Wallet, label: 'Assets' },
    { to: '/dashboard/beneficiaries', icon: Users, label: 'Beneficiaries' },
    { to: '/dashboard/family-tree', icon: GitBranch, label: 'Family Tree' },
    { to: '/dashboard/letters', icon: Mail, label: 'AI Letters' },
    { to: '/dashboard/simulator', icon: TrendingUp, label: 'Simulator' },
    { to: '/dashboard/dead-man-switch', icon: Clock, label: 'Dead Man\'s Switch' },
  ];

  return (
    <div className="flex min-h-screen bg-[#060918]">
      <aside className="w-64 bg-[#0a0d1a] border-r border-[#151a2e] p-4 flex flex-col fixed h-full z-20">
        <div className="text-2xl font-bold mb-8 gradient-text tracking-tight">
          Inheritance OS
        </div>
        <nav className="space-y-1 flex-1">
          {items.map(i => (
            <NavLink key={i.to} to={i.to} end
              className={({isActive}) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-[#151a2e] hover:text-white'
                }`
              }>
              <i.icon size={18} />{i.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-[#151a2e]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">R</div>
            <div>
              <div className="text-sm font-medium">Raj Kumar</div>
              <div className="text-xs text-slate-500">raj@example.com</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 overflow-auto bg-grid min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
