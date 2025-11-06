// src/components/marketing/PropuestasPreview.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const propuestas = [
  { 
    id: 1, 
    tema: 'Kotlin Avanzado', 
    departamento: 'Desarrollo', 
    fecha: '2025-11-04', 
    estado: 'pendiente',
    prioridad: 'alta'
  },
  { 
    id: 2, 
    tema: 'React Native 2025', 
    departamento: 'Móvil', 
    fecha: '2025-11-03', 
    estado: 'aprobada',
    prioridad: 'media'
  },
  { 
    id: 3, 
    tema: 'IA para Negocios', 
    departamento: 'Estrategia', 
    fecha: '2025-11-02', 
    estado: 'en_revision',
    prioridad: 'alta'
  },
  { 
    id: 4, 
    tema: 'Python Machine Learning', 
    departamento: 'Data Science', 
    fecha: '2025-11-01', 
    estado: 'pendiente',
    prioridad: 'baja'
  },
];

const estadoConfig = {
  pendiente: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-900/50',
    label: 'Pendiente',
    icon: Clock,
  },
  aprobada: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-900/50',
    label: 'Aprobada',
    icon: CheckCircle,
  },
  en_revision: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-900/50',
    label: 'En Revisión',
    icon: AlertCircle,
  },
};

const prioridadColor = {
  alta: 'border-l-4 border-l-red-500',
  media: 'border-l-4 border-l-yellow-500',
  baja: 'border-l-4 border-l-green-500',
};

export default function PropuestasPreview() {
  return (
    <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Propuestas de Contenido
        </CardTitle>
        <a 
          href="/marketing/propuestas" 
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline smooth-transition"
        >
          Ver todas →
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {propuestas.slice(0, 3).map(p => {
            const estadoInfo = estadoConfig[p.estado as keyof typeof estadoConfig];
            const StatusIcon = estadoInfo.icon;
            const prioridadClass = prioridadColor[p.prioridad as keyof typeof prioridadColor];
            
            return (
              <a
                key={p.id}
                href={'/marketing/propuestas/' + p.id}
                className={'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg smooth-transition border border-gray-200 dark:border-gray-800 group ' + prioridadClass}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 smooth-transition">
                      {p.tema}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{p.departamento}</span>
                    <span>•</span>
                    <span>{new Date(p.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                <div className={'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ' + estadoInfo.bg + ' ' + estadoInfo.text + ' ' + estadoInfo.border}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {estadoInfo.label}
                </div>
              </a>
            );
          })}
          
          
            <a
              href="/marketing/propuestas"
            className="flex items-center justify-center w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 smooth-transition group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:scale-110 smooth-transition" />
            Nueva Propuesta
          </a>
        </div>
      </CardContent>
    </Card>
  );
}