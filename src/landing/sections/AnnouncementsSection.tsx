import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, AlertCircle, Megaphone, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Announcement {
  id: number;
  title: string;
  description: string;
  type: 'news' | 'alert' | 'announcement';
  priority: 'high' | 'medium' | 'low';
  published_at: string;
  link?: string;
}

const typeConfig = {
  news: { label: 'Noticia', icon: Newspaper, variant: 'default' as const },
  alert: { label: 'Alerta', icon: AlertCircle, variant: 'destructive' as const },
  announcement: { label: 'Anuncio', icon: Megaphone, variant: 'secondary' as const },
};

const priorityConfig = {
  high: 'border-l-4 border-l-destructive',
  medium: 'border-l-4 border-l-yellow-500',
  low: 'border-l-4 border-l-green-500',
};

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de datos
    setTimeout(() => {
      setAnnouncements([
        {
          id: 1,
          title: "Nuevo curso de Desarrollo Web Full Stack",
          description: "Inscripciones abiertas para el nuevo curso que inicia el 15 de febrero",
          type: "news",
          priority: "high",
          published_at: "2025-01-20T10:00:00Z",
          link: "/academico/grupos/disponible"
        },
        {
          id: 2,
          title: "Mantenimiento programado - 25 de enero",
          description: "La plataforma estará en mantenimiento de 2am a 4am",
          type: "alert",
          priority: "medium",
          published_at: "2025-01-18T14:30:00Z"
        },
        {
          id: 3,
          title: "Nuevo convenio con Universidad Nacional",
          description: "Descuentos del 20% para estudiantes universitarios",
          type: "announcement",
          priority: "low",
          published_at: "2025-01-15T09:00:00Z"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Últimas Novedades
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mantente informado sobre nuestros nuevos cursos, eventos y actualizaciones importantes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {announcements.map((announcement) => {
          const TypeIcon = typeConfig[announcement.type].icon;

          return (
            <Card
              key={announcement.id}
              className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${priorityConfig[announcement.priority]}`}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={typeConfig[announcement.type].variant} className="gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {typeConfig[announcement.type].label}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3" />
                  {new Date(announcement.published_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {announcement.description}
                </p>
                {announcement.link && (
                  <Button variant="ghost" className="gap-2 p-0 h-auto" asChild>
                    <a href={announcement.link}>
                      Ver más
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
