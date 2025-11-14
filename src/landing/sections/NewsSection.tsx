import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";

// Datos de ejemplo - En producción vendrían de la API
const recentNews = [
  {
    id: 1,
    title: "Nuevos cursos de Inteligencia Artificial disponibles para 2025",
    excerpt: "Amplía tus habilidades con nuestros nuevos cursos especializados en IA, Machine Learning y Deep Learning.",
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    category: "Cursos",
    date: "2025-01-15",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Convenio con empresas tecnológicas líderes del país",
    excerpt: "Nuestros estudiantes tendrán acceso a prácticas profesionales y oportunidades laborales exclusivas.",
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    category: "Alianzas",
    date: "2025-01-10",
    readTime: "4 min"
  },
  {
    id: 3,
    title: "Celebramos 100 egresados certificados en desarrollo web",
    excerpt: "Un hito importante para nuestra institución. Conoce las historias de éxito de nuestros graduados.",
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    category: "Logros",
    date: "2025-01-05",
    readTime: "3 min"
  }
];

const categoryColors = {
  "Cursos": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Alianzas": "bg-green-500/10 text-green-600 dark:text-green-400",
  "Logros": "bg-purple-500/10 text-purple-600 dark:text-purple-400"
};

export default function NewsSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <Newspaper className="h-3 w-3 mr-1" />
          Últimas Noticias
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Mantente Informado
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Las últimas novedades, eventos y logros de nuestra comunidad educativa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {recentNews.map((news) => (
          <Card key={news.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            {/* Imagen de la noticia */}
            <div className="relative h-48 overflow-hidden bg-muted/30">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <Badge className={categoryColors[news.category as keyof typeof categoryColors]}>
                  {news.category}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(news.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{news.readTime}</span>
                </div>
              </div>
              <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                {news.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {news.excerpt}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
              <Button variant="ghost" className="w-full gap-2 group/btn" asChild>
                <a href={`/tecnologico/web/noticias/${news.id}`}>
                  Leer más
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ver todas las noticias */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="gap-2" asChild>
          <a href="/tecnologico/web/noticias">
            Ver todas las noticias
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
