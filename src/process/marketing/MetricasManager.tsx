// src/components/marketing/MetricasManager.tsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, MessageSquare, Target, Filter, DollarSign, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Tabs removed - using custom button navigation
import PropuestaMetricasTable from './metricas/PropuestaMetricasTable';
import PublicacionesTable from './metricas/PublicacionesTable';
import GraficoComparativa from './metricas/GraficoComparativa';
import GraficoTendencia from './metricas/GraficoTendencia';

interface KPI {
  label: string;
  value: number | string;
  trend?: number;
  icon: any;
  color: string;
}

const kpisMock: KPI[] = [
  {
    label: 'Propuestas Activas',
    value: 12,
    trend: 15,
    icon: Target,
    color: 'blue'
  },
  {
    label: 'Publicaciones Totales',
    value: 47,
    trend: 28,
    icon: TrendingUp,
    color: 'purple'
  },
  {
    label: 'Total Likes',
    value: '8.5K',
    trend: 32,
    icon: TrendingUp,
    color: 'pink'
  },
  {
    label: 'Total Comentarios',
    value: '1.2K',
    trend: 18,
    icon: MessageSquare,
    color: 'cyan'
  },
  {
    label: 'Total Compartidos',
    value: 234,
    trend: 15,
    icon: TrendingUp,
    color: 'green'
  },
  {
    label: 'Mensajes Recibidos',
    value: 168,
    trend: 18,
    icon: MessageSquare,
    color: 'orange'
  },
  {
    label: 'Preinscripciones',
    value: 86,
    trend: 12,
    icon: Target,
    color: 'blue'
  },
  {
    label: '% Intención Matrícula',
    value: '51.2%',
    trend: 5,
    icon: Target,
    color: 'orange'
  },
  {
    label: 'CPA Promedio',
    value: 'S/ 11.63',
    trend: -8,
    icon: DollarSign,
    color: 'pink'
  },
  {
    label: 'Matrículas Proyectadas',
    value: 55,
    trend: 10,
    icon: GraduationCap,
    color: 'green'
  },
];

const colorMap: { [key: string]: string } = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
};

type TabType = 'propuestas' | 'publicaciones' | 'comparativa' | 'chatbot';

export default function MetricasManager() {
  const [periodo, setPeriodo] = useState('7dias');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCanal, setFiltroCanal] = useState('todos');
  const [activeTab, setActiveTab] = useState<TabType>('propuestas');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Métricas y Analíticas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Análisis de rendimiento de propuestas y decisión de apertura de cursos
          </p>
        </div>

        {/* Filtros principales */}
        <div className="flex gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="7dias">Últimos 7 días</SelectItem>
              <SelectItem value="30dias">Últimos 30 días</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Más filtros
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpisMock.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${colorMap[kpi.color]} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                </div>
                {kpi.trend !== undefined && (
                  <div className={`flex items-center gap-1 text-xs ${
                    kpi.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {kpi.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(kpi.trend)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {kpi.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 overflow-x-auto">
        <Button
          variant={activeTab === 'propuestas' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('propuestas')}
        >
          Propuestas
        </Button>
        <Button
          variant={activeTab === 'publicaciones' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('publicaciones')}
        >
          Publicaciones
        </Button>
        <Button
          variant={activeTab === 'comparativa' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('comparativa')}
        >
          Comparativa
        </Button>
        <Button
          variant={activeTab === 'chatbot' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('chatbot')}
        >
          Chatbot
        </Button>
      </div>

      {/* Tab 1: Propuestas con métricas */}
      {activeTab === 'propuestas' && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="analisis">En análisis</SelectItem>
                <SelectItem value="pendiente">Pendiente decisión</SelectItem>
                <SelectItem value="aprobadas">Aprobadas</SelectItem>
                <SelectItem value="archivadas">Archivadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroCanal} onValueChange={setFiltroCanal}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los canales</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="messenger">Messenger</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PropuestaMetricasTable />
        </div>
      )}

      {/* Tab 2: Publicaciones */}
      {activeTab === 'publicaciones' && (
        <div className="space-y-6">
          <PublicacionesTable />
        </div>
      )}

      {/* Tab 3: Comparativa */}
      {activeTab === 'comparativa' && (
        <div className="space-y-6">
          <GraficoComparativa />
        </div>
      )}

      {/* Tab 4: Chatbot */}
      {activeTab === 'chatbot' && (
        <div className="space-y-6">
          <GraficoTendencia />
        </div>
      )}
    </div>
  );
}
