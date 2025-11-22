import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Newspaper, Eye } from "lucide-react";
import { config } from "@/config/technology-config";

interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image_url: string;
  category: string;
  published_date: string;
  views: number;
  reading_time: string;
  author: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.developerWeb.landing.news}`);
      const data = await response.json();

      if (data.success && data.data) {
        setNews(data.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

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
        {news.map((item) => (
          <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            {/* Imagen de la noticia */}
            <div className="relative h-48 overflow-hidden bg-muted/30">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary/90 backdrop-blur">
                  {item.category}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.published_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.reading_time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{item.views}</span>
                </div>
              </div>
              <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {item.summary}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
              <p className="text-xs text-muted-foreground mb-3">Por {item.author}</p>
              <Button variant="ghost" className="w-full gap-2 group/btn" asChild>
                <a href={`/noticias/${item.slug}`}>
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
          <a href="/noticias">
            Ver todas las noticias
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
