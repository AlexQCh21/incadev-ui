// src/components/marketing/metricas/PropuestaMetricasTable.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PropuestaMetrica {
  id: number;
  nombre: string;
  estado: 'analisis' | 'pendiente' | 'aprobado' | 'archivado';
  publicaciones: number;
  alcance: number;
  engagement: number;
  conversaciones: number;
  leads: number;
  ctr: number;
  score: number;
  gastoMarketing: number; // Gasto en marketing (S/)
  tasaConversionHistorica: number; // Porcentaje de conversión esperado (0.66 = 66%)
  detalles?: {
    posts: Array<{
      texto: string;
      alcance: number;
      likes: number;
      comentarios: number;
      compartidos: number;
    }>;
    preguntasFrecuentes: Array<{
      pregunta: string;
      veces: number;
    }>;
  };
}

// Funciones helper para cálculos
const calcularCPA = (gasto: number, leads: number): number => {
  return leads > 0 ? gasto / leads : 0;
};

const calcularMatriculasProyectadas = (leads: number, tasaConversion: number): number => {
  return Math.round(leads * tasaConversion);
};

const calcularPorcentajeIntencion = (leads: number, conversaciones: number): number => {
  return conversaciones > 0 ? (leads / conversaciones) * 100 : 0;
};

const propuestasMock: PropuestaMetrica[] = [
  {
    id: 1,
    nombre: 'Kotlin Avanzado',
    estado: 'pendiente',
    publicaciones: 3,
    alcance: 12500,
    engagement: 1234,
    conversaciones: 45,
    leads: 23,
    ctr: 9.8,
    score: 8.5,
    gastoMarketing: 230, // S/ 230
    tasaConversionHistorica: 0.65, // 65% de conversión esperada
    detalles: {
      posts: [
        { texto: '¿Quieres aprender Kotlin? 🚀', alcance: 4200, likes: 234, comentarios: 45, compartidos: 12 },
        { texto: 'Kotlin para Android Developers', alcance: 5800, likes: 389, comentarios: 67, compartidos: 28 },
        { texto: 'Últimos días para inscribirse', alcance: 2500, likes: 123, comentarios: 12, compartidos: 8 },
      ],
      preguntasFrecuentes: [
        { pregunta: 'precio', veces: 15 },
        { pregunta: 'duración', veces: 12 },
        { pregunta: 'certificado', veces: 8 },
      ]
    }
  },
  {
    id: 2,
    nombre: 'Python Machine Learning',
    estado: 'aprobado',
    publicaciones: 5,
    alcance: 18300,
    engagement: 2156,
    conversaciones: 67,
    leads: 34,
    ctr: 11.2,
    score: 9.2,
    gastoMarketing: 340, // S/ 340
    tasaConversionHistorica: 0.70, // 70% de conversión esperada
  },
  {
    id: 3,
    nombre: 'Java Spring Boot',
    estado: 'archivado',
    publicaciones: 2,
    alcance: 3200,
    engagement: 234,
    conversaciones: 8,
    leads: 2,
    ctr: 2.5,
    score: 3.1,
    gastoMarketing: 100, // S/ 100
    tasaConversionHistorica: 0.50, // 50% de conversión esperada
  },
  {
    id: 4,
    nombre: 'React Native 2025',
    estado: 'analisis',
    publicaciones: 4,
    alcance: 9800,
    engagement: 735,
    conversaciones: 28,
    leads: 15,
    ctr: 7.5,
    score: 7.8,
    gastoMarketing: 180, // S/ 180
    tasaConversionHistorica: 0.60, // 60% de conversión esperada
  },
  {
    id: 5,
    nombre: 'Flutter Development',
    estado: 'pendiente',
    publicaciones: 3,
    alcance: 7600,
    engagement: 471,
    conversaciones: 22,
    leads: 12,
    ctr: 6.2,
    score: 6.5,
    gastoMarketing: 150, // S/ 150
    tasaConversionHistorica: 0.58, // 58% de conversión esperada
  },
];

const estadoConfig = {
  analisis: { label: 'En análisis', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' },
  pendiente: { label: 'Pendiente decisión', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400' },
  aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' },
  archivado: { label: 'Archivado', color: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' },
};

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-600 dark:text-green-400';
  if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function PropuestaMetricasTable() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {propuestasMock.map((propuesta) => (
        <Card key={propuesta.id} className="overflow-hidden">
          {/* Header - Info principal */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleExpand(propuesta.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  {expandedId === propuesta.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {propuesta.nombre}
                  </h3>
                  <Badge className={estadoConfig[propuesta.estado].color}>
                    {estadoConfig[propuesta.estado].label}
                  </Badge>
                </div>

                <div className="text-right">
                  <p className={`text-2xl font-bold ${getScoreColor(propuesta.score)}`}>
                    {propuesta.score}
                  </p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
            </div>

            {/* Métricas principales en grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {propuesta.publicaciones}
                </p>
              </div>

              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Alcance</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatNumber(propuesta.alcance)}
                </p>
              </div>

              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formatNumber(propuesta.engagement)}
                </p>
              </div>

              <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Mensajes</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {propuesta.conversaciones}
                </p>
              </div>

              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Preinscripciones</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {propuesta.leads}
                </p>
              </div>

              <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">CTR</p>
                <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                  {propuesta.ctr}%
                </p>
              </div>

              {/* NUEVAS MÉTRICAS */}
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">% Intención</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {calcularPorcentajeIntencion(propuesta.leads, propuesta.conversaciones).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-3 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">CPA</p>
                <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                  S/ {calcularCPA(propuesta.gastoMarketing, propuesta.leads).toFixed(2)}
                </p>
              </div>

              <div className="text-center p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Proyección</p>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  {calcularMatriculasProyectadas(propuesta.leads, propuesta.tasaConversionHistorica)}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <Button variant="outline" size="sm" className="gap-2">
                  Ver más
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Barra de progreso del score */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Viabilidad
                </span>
                <span className={`text-sm font-bold ${getScoreColor(propuesta.score)}`}>
                  {propuesta.score}/10
                </span>
              </div>
              <Progress value={propuesta.score * 10} className="h-2" />
            </div>
          </div>

          {/* Detalles expandibles */}
          {expandedId === propuesta.id && propuesta.detalles && (
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Publicaciones detalladas */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    📱 Publicaciones en Facebook
                  </h4>
                  <div className="space-y-2">
                    {propuesta.detalles.posts.map((post, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-900 dark:text-white mb-2">
                          {post.texto}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>👁️ {formatNumber(post.alcance)}</span>
                          <span>👍 {post.likes}</span>
                          <span>💬 {post.comentarios}</span>
                          <span>🔄 {post.compartidos}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preguntas frecuentes */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    🔥 Preguntas Frecuentes (Chatbot)
                  </h4>
                  <div className="space-y-2">
                    {propuesta.detalles.preguntasFrecuentes.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          "{item.pregunta}"
                        </span>
                        <Badge variant="secondary">{item.veces}x</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      💡 Tasa de conversión: Chat → Lead: {((propuesta.leads / propuesta.conversaciones) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* NUEVA SECCIÓN: Métricas de conversión esperada */}
              <div className="lg:col-span-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📊 Conversión Esperada y Costos
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* % Intención de Matrícula */}
                  <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-900">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        % Intención de Matrícula
                      </p>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                      {calcularPorcentajeIntencion(propuesta.leads, propuesta.conversaciones).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {propuesta.leads} de {propuesta.conversaciones} interesados
                    </p>
                  </Card>

                  {/* CPA - Costo por Persona Interesada */}
                  <Card className="p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 border-pink-200 dark:border-pink-900">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        CPA (Costo por Lead)
                      </p>
                      <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                      S/ {calcularCPA(propuesta.gastoMarketing, propuesta.leads).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Gasto: S/ {propuesta.gastoMarketing} ÷ {propuesta.leads} leads
                    </p>
                  </Card>

                  {/* Proyección de Matrículas Reales */}
                  <Card className="p-4 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20 border-teal-200 dark:border-teal-900">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Matrículas Proyectadas
                      </p>
                      <span className="text-2xl">🎓</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                      {calcularMatriculasProyectadas(propuesta.leads, propuesta.tasaConversionHistorica)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {propuesta.leads} leads × {(propuesta.tasaConversionHistorica * 100).toFixed(0)}% conversión
                    </p>
                  </Card>
                </div>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    ✅ Se estima que de {propuesta.leads} preinscripciones, aproximadamente {calcularMatriculasProyectadas(propuesta.leads, propuesta.tasaConversionHistorica)} estudiantes concretarán su matrícula ({(propuesta.tasaConversionHistorica * 100).toFixed(0)}%)
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
