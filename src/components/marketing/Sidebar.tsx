// src/components/marketing/Sidebar.tsx
import React from 'react';
import { LayoutDashboard, FileText, Calendar, Users, TrendingUp } from 'lucide-react';
import { ModeToggle } from '../core/ModeToggle';

interface NavItem {
  href: string;
  icon: any;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/marketing/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/marketing/propuestas', icon: FileText, label: 'Propuestas' },
  { href: '/marketing/campañas', icon: TrendingUp, label: 'Campañas' },
  { href: '/marketing/cursos', icon: Calendar, label: 'Cursos' },
  { href: '/marketing/alumnos', icon: Users, label: 'Alumnos' },
  { href: '/marketing/metricas', icon: TrendingUp, label: 'Métricas' },
];

export default function Sidebar() {
  const [currentPath, setCurrentPath] = React.useState('/marketing/dashboard');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-6 smooth-transition z-50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">INCADEV</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Marketing Hub</p>
          </div>
        </div>
        <ModeToggle />
      </div>

      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive 
                ? 'flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition group bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                : 'flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition group text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive ? <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div> : null}
            </a>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">MK</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Marketing Team</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Equipo activo</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}