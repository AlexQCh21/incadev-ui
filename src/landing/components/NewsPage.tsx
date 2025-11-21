import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Newspaper, TrendingUp } from "lucide-react";

// Datos de noticias - En producción vendrían de la API
const allNews = [
  {
    id: 1,
    title: "Nuevos cursos de Inteligencia Artificial disponibles para 2025",
    excerpt: "Amplía tus habilidades con nuestros nuevos cursos especializados en IA, Machine Learning y Deep Learning.",
    content: "INCADEV se complace en anunciar el lanzamiento de su nueva línea de cursos especializados en Inteligencia Artificial...",
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    category: "Cursos",
    date: "2025-01-15",
    readTime: "5 min",
    featured: true
  },
  {
    id: 2,
    title: "Convenio con empresas tecnológicas líderes del país",
    excerpt: "Nuestros estudiantes tendrán acceso a prácticas profesionales y oportunidades laborales exclusivas.",
    content: "INCADEV firma convenio estratégico con las principales empresas de tecnología del país para ofrecer oportunidades laborales...",
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    category: "Alianzas",
    date: "2025-01-10",
    readTime: "4 min",
    featured: true
  },
  {
    id: 3,
    title: "Celebramos 100 egresados certificados en desarrollo web",
    excerpt: "Un hito importante para nuestra institución. Conoce las historias de éxito de nuestros graduados.",
    content: "Este mes celebramos un hito histórico: 100 estudiantes han completado exitosamente nuestro programa de Desarrollo Web...",
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    category: "Logros",
    date: "2025-01-05",
    readTime: "3 min",
    featured: true
  },
  {
    id: 4,
    title: "Hackathon 2025: Innovación y Tecnología",
    excerpt: "Participa en nuestro primer hackathon presencial. Premios de hasta S/ 5,000 para los ganadores.",
    content: "INCADEV organiza su primer hackathon presencial donde estudiantes y profesionales competirán en desafíos tecnológicos...",
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    category: "Eventos",
    date: "2025-01-03",
    readTime: "6 min",
    featured: false
  },
  {
    id: 5,
    title: "Nuevas instalaciones: Laboratorio de Ciberseguridad",
    excerpt: "Inauguramos nuestro moderno laboratorio equipado con las últimas herramientas de pentesting y análisis forense.",
    content: "Como parte de nuestro compromiso con la educación de calidad, inauguramos nuestro nuevo laboratorio de ciberseguridad...",
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    category: "Infraestructura",
    date: "2024-12-28",
    readTime: "4 min",
    featured: false
  },
  {
    id: 6,
    title: "Webinar gratuito: Tendencias tecnológicas 2025",
    excerpt: "Únete a nuestro webinar con expertos de la industria sobre las tecnologías que dominarán este año.",
    content: "No te pierdas nuestro webinar gratuito donde expertos de empresas líderes compartirán las tendencias tecnológicas...",
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    category: "Eventos",
    date: "2024-12-20",
    readTime: "3 min",
    featured: false
  },
  {
    id: 7,
    title: "Estudiantes de INCADEV ganan competencia nacional de programación",
    excerpt: "Nuestro equipo se llevó el primer lugar en el Coding Challenge Nacional 2024.",
    content: "Con orgullo anunciamos que nuestro equipo de estudiantes ganó el primer lugar en el Coding Challenge Nacional...",
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    category: "Logros",
    date: "2024-12-15",
    readTime: "5 min",
    featured: false
  },
  {
    id: 8,
    title: "Programa de becas 2025: Convocatoria abierta",
    excerpt: "Postula a nuestro programa de becas completas y parciales. Hasta 30 becas disponibles.",
    content: "INCADEV abre su convocatoria anual de becas académicas para estudiantes destacados con necesidades económicas...",
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    category: "Becas",
    date: "2024-12-10",
    readTime: "7 min",
    featured: false
  },
  {
    id: 9,
    title: "Actualización de contenidos: Cursos renovados para 2025",
    excerpt: "Todos nuestros cursos han sido actualizados con los últimos frameworks y tecnologías del mercado.",
    content: "En INCADEV nos mantenemos a la vanguardia. Por eso, hemos actualizado el contenido de todos nuestros cursos...",
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    category: "Cursos",
    date: "2024-12-05",
    readTime: "4 min",
    featured: false
  }
];

const categoryColors: Record<string, string> = {
  "Cursos": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "Alianzas": "bg-green-500/10 text-green-600 dark:text-green-400",
  "Logros": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Eventos": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "Infraestructura": "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "Becas": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
};

export default function NewsPage() {
  const featuredNews = allNews.filter(news => news.featured);
  const regularNews = allNews.filter(news => !news.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-20 md:py-24 max-w-[1400px]">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
          <a href="/" className="hover:text-foreground transition-colors">
            Inicio
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">Noticias</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Newspaper className="h-4 w-4" />
            <span>Centro de Noticias</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Últimas Noticias
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Mantente informado sobre eventos, logros, nuevos cursos y todo lo que sucede en INCADEV
          </p>
        </div>

        {/* Últimas Noticias Destacadas */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Noticias Destacadas</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredNews.map((news) => (
              <Card
                key={news.id}
                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border-2 border-primary/20"
              >
                {/* Imagen de la noticia */}
                <div className="relative h-56 overflow-hidden bg-muted/30">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className={categoryColors[news.category]}>
                      {news.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/95 backdrop-blur-sm shadow-md">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Destacado
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
        </div>

        {/* Todas las Noticias */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Todas las Noticias</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((news) => (
              <Card
                key={news.id}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Imagen de la noticia */}
                <div className="relative h-48 overflow-hidden bg-muted/30">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3">
                    <Badge className={categoryColors[news.category]}>
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
        </div>
      </div>
    </div>
  );
}
