// src/components/marketing/AlumnosResumen.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserCheck, UserX, MessageCircle, GraduationCap, TrendingUp } from 'lucide-react';

const stats = [
  { 
    label: 'Matriculados', 
    value: 342, 
    icon: UserCheck, 
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-900/50',
    trend: '+12%'
  },
  { 
    label: 'Inactivos', 
    value: 28, 
    icon: UserX, 
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-900/50',
    trend: '-5%'
  },
  { 
    label: 'Solicitudes Info', 
    value: 67, 
    icon: MessageCircle, 
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/50',
    trend: '+23%'
  },
  { 
    label: 'Egresados', 
    value: 189, 
    icon: GraduationCap, 
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900/50',
    trend: '+8%'
  },
];

export default function AlumnosResumen() {
  return (
    <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 dark:text-white text-lg">
          Seguimiento de Alumnos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon;
            const isPositive = s.trend.startsWith('+');
            const trendClass = isPositive 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400';
            
            return (
              <div 
                key={s.label} 
                className={'p-4 rounded-lg border hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer group ' + s.bg + ' ' + s.border}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={'p-3 rounded-full ' + s.bg}>
                    <Icon className={'w-6 h-6 group-hover:scale-110 transition-all duration-200 ease-in-out ' + s.color} />
                  </div>
                  <div>
                    <p className={'text-2xl font-bold ' + s.color}>{s.value}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                      {s.label}
                    </p>
                  </div>
                  <div className={'flex items-center gap-1 text-xs font-medium ' + trendClass}>
                    <TrendingUp className={isPositive ? 'w-3 h-3' : 'w-3 h-3 rotate-180'} />
                    {s.trend}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href="/marketing/alumnos"
              className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm text-center transition-all duration-200 ease-in-out"
            >
              Ver reporte completo
            </a>
            <button
              className="py-2.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-all duration-200 ease-in-out"
            >
              Exportar datos
            </button>
          </div>
      </CardContent>
    </Card>
  );
}