// src/components/marketing/metricas/PublicacionesTable.tsx
import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, Eye, Calendar, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Publicacion {
  id: number;
  propuesta: string;
  contenido: string;
  canal: 'facebook' | 'instagram';
  tipo: 'post' | 'video' | 'imagen';
  campania?: string; // Nombre de la campaña si pertenece a una
  fecha: string;
  alcance: number;
  impresiones: number;
  likes: number;
  comentarios: number;
  compartidos: number;
  clics: number;
  guardados?: number;
  engagement_rate: number;
}

const publicacionesMock: Publicacion[] = [
  {
    id: 1,
    propuesta: 'Kotlin Avanzado',
    contenido: '¿Quieres aprender Kotlin? 🚀 Descubre nuestro nuevo curso avanzado para desarrolladores Android...',
    canal: 'facebook',
    tipo: 'post',
    campania: 'Campaña Noviembre 2025',
    fecha: '2025-11-05 14:30',
    alcance: 4200,
    impresiones: 5300,
    likes: 234,
    comentarios: 45,
    compartidos: 12,
    clics: 89,
    guardados: 23,
    engagement_rate: 9.8
  },
  {
    id: 2,
    propuesta: 'Kotlin Avanzado',
    contenido: 'Kotlin para Android Developers - Aprende las mejores prácticas 📱',
    canal: 'instagram',
    tipo: 'imagen',
    campania: 'Campaña Noviembre 2025',
    fecha: '2025-11-06 10:15',
    alcance: 5800,
    impresiones: 7200,
    likes: 389,
    comentarios: 67,
    compartidos: 28,
    clics: 124,
    guardados: 45,
    engagement_rate: 11.2
  },
  {
    id: 3,
    propuesta: 'Python ML',
    contenido: 'Machine Learning con Python desde cero 🤖 Conviértete en Data Scientist',
    canal: 'facebook',
    tipo: 'video',
    campania: 'Black Friday Tech',
    fecha: '2025-11-07 16:00',
    alcance: 8500,
    impresiones: 10200,
    likes: 512,
    comentarios: 89,
    compartidos: 45,
    clics: 234,
    guardados: 67,
    engagement_rate: 12.5
  },
  {
    id: 4,
    propuesta: 'React Native',
    contenido: 'Desarrollo móvil multiplataforma con React Native 📲',
    canal: 'facebook',
    tipo: 'post',
    fecha: '2025-11-04 09:00',
    alcance: 2100,
    impresiones: 2800,
    likes: 123,
    comentarios: 18,
    compartidos: 8,
    clics: 45,
    engagement_rate: 7.5
  },
  {
    id: 5,
    propuesta: 'Flutter',
    contenido: 'Flutter: Crea apps hermosas para iOS y Android con un solo código 🎨',
    canal: 'instagram',
    tipo: 'imagen',
    campania: 'Campaña Noviembre 2025',
    fecha: '2025-11-03 13:30',
    alcance: 3400,
    impresiones: 4100,
    likes: 187,
    comentarios: 23,
    compartidos: 11,
    clics: 56,
    guardados: 34,
    engagement_rate: 6.8
  },
];

const canalConfig = {
  facebook: { icon: '📘', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' },
  instagram: { icon: '📷', color: 'bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400' },
};

const tipoConfig = {
  post: { icon: '📝', label: 'Post' },
  video: { icon: '🎥', label: 'Video' },
  imagen: { icon: '🖼️', label: 'Imagen' },
};

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function PublicacionesTable() {
  const [filtroCanal, setFiltroCanal] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCampania, setFiltroCampania] = useState('todas');

  const publicacionesFiltradas = publicacionesMock.filter((pub) => {
    const matchCanal = filtroCanal === 'todos' || pub.canal === filtroCanal;
    const matchTipo = filtroTipo === 'todos' || pub.tipo === filtroTipo;
    const matchCampania = filtroCampania === 'todas' ||
      (filtroCampania === 'sin_campania' && !pub.campania) ||
      (filtroCampania !== 'sin_campania' && pub.campania === filtroCampania);
    return matchCanal && matchTipo && matchCampania;
  });

  // Obtener lista única de campañas
  const campanias = Array.from(new Set(publicacionesMock.map(p => p.campania).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <Select value={filtroCanal} onValueChange={setFiltroCanal}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los canales</SelectItem>
            <SelectItem value="facebook">📘 Facebook</SelectItem>
            <SelectItem value="instagram">📷 Instagram</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="post">📝 Post</SelectItem>
            <SelectItem value="video">🎥 Video</SelectItem>
            <SelectItem value="imagen">🖼️ Imagen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroCampania} onValueChange={setFiltroCampania}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Campaña" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las campañas</SelectItem>
            <SelectItem value="sin_campania">Sin campaña</SelectItem>
            {campanias.map((campania) => (
              <SelectItem key={campania} value={campania!}>
                {campania}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid de publicaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {publicacionesFiltradas.map((pub) => (
          <Card key={pub.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={canalConfig[pub.canal].color}>
                    {canalConfig[pub.canal].icon} {pub.canal.charAt(0).toUpperCase() + pub.canal.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {tipoConfig[pub.tipo].icon} {tipoConfig[pub.tipo].label}
                  </Badge>
                  {pub.campania && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                      📢 {pub.campania}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {pub.propuesta}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(pub.fecha).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className={`text-xl font-bold ${
                  pub.engagement_rate >= 10
                    ? 'text-green-600 dark:text-green-400'
                    : pub.engagement_rate >= 7
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {pub.engagement_rate}%
                </p>
                <p className="text-xs text-gray-500">Engagement</p>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {pub.contenido}
              </p>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatNumber(pub.alcance)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Alcance</p>
              </div>

              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {formatNumber(pub.impresiones)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Impresiones</p>
              </div>

              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {pub.clics}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Clics</p>
              </div>
            </div>

            {/* Interacciones */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <ThumbsUp className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{pub.likes}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">{pub.comentarios}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <Share2 className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">{pub.compartidos}</span>
                </div>

                {pub.guardados && (
                  <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold">{pub.guardados}</span>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm">
                Ver detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
