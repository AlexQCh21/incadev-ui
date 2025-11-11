import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";

// Cursos destacados
const featuredCourses = [
  {
    id: 1,
    name: "Desarrollo Web Full Stack",
    description: "Aprende a crear aplicaciones web completas con tecnologías modernas como React, Node.js y bases de datos",
    price: 350,
    duration: "12 semanas",
    students: 45,
    rating: 4.8,
    modules: 8,
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    level: "Intermedio",
    category: "Programación",
    featured: true
  },
  {
    id: 4,
    name: "React Avanzado y Next.js",
    description: "Desarrolla aplicaciones web modernas con React 18, Next.js 14 y las últimas características del ecosistema",
    price: 400,
    duration: "14 semanas",
    students: 35,
    rating: 4.9,
    modules: 10,
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    level: "Avanzado",
    category: "Programación",
    featured: true
  },
  {
    id: 6,
    name: "Machine Learning con Python",
    description: "Domina los algoritmos de aprendizaje automático y construye modelos predictivos con scikit-learn y TensorFlow",
    price: 450,
    duration: "16 semanas",
    students: 28,
    rating: 4.9,
    modules: 12,
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    level: "Avanzado",
    category: "Data Science",
    featured: true
  },
  {
    id: 8,
    name: "Ciberseguridad y Ethical Hacking",
    description: "Aprende a proteger sistemas y redes, realiza auditorías de seguridad y ethical hacking",
    price: 420,
    duration: "14 semanas",
    students: 31,
    rating: 4.8,
    modules: 11,
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    level: "Avanzado",
    category: "Seguridad",
    featured: true
  }
];

export default function FeaturedCoursesSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredCourses.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === featuredCourses.length - 1 ? 0 : prev + 1));
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const absIndex = Math.abs(diff);

    if (diff === 0) {
      // Tarjeta central
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)'
      };
    } else if (diff === 1 || diff === -(featuredCourses.length - 1)) {
      // Tarjeta derecha
      return {
        transform: 'translateX(70%) scale(0.85) rotateY(-25deg)',
        zIndex: 20,
        opacity: 0.7,
        filter: 'brightness(0.8)'
      };
    } else if (diff === -1 || diff === featuredCourses.length - 1) {
      // Tarjeta izquierda
      return {
        transform: 'translateX(-70%) scale(0.85) rotateY(25deg)',
        zIndex: 20,
        opacity: 0.7,
        filter: 'brightness(0.8)'
      };
    } else if (absIndex === 2) {
      // Tarjetas más alejadas
      return {
        transform: diff > 0 ? 'translateX(140%) scale(0.7) rotateY(-35deg)' : 'translateX(-140%) scale(0.7) rotateY(35deg)',
        zIndex: 10,
        opacity: 0.4,
        filter: 'brightness(0.6)'
      };
    } else {
      // Tarjetas ocultas
      return {
        transform: 'translateX(0%) scale(0.5)',
        zIndex: 0,
        opacity: 0,
        filter: 'brightness(0.5)'
      };
    }
  };

  return (
    <div className="w-full py-8">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4">
          <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
          Cursos Destacados
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Los Mejores Cursos del Momento
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Cursos más populares y mejor valorados por nuestros estudiantes
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative h-[500px] mb-8" style={{ perspective: '2000px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {featuredCourses.map((course, index) => (
            <div
              key={course.id}
              className="absolute w-full max-w-md transition-all duration-700 ease-out"
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d'
              }}
            >
              <Card className="overflow-hidden border-2 shadow-2xl h-full">
                {/* Imagen del curso */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-md">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/95 backdrop-blur-sm shadow-md">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-yellow-500/90 text-yellow-950 backdrop-blur-sm shadow-md">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Destacado
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{course.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Estadísticas del curso */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Módulos */}
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 inline mr-1" />
                      {course.modules} módulos
                    </p>
                  </div>

                  {/* Precio y CTA */}
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        S/ {course.price}
                      </span>
                      <span className="text-sm text-muted-foreground">por curso</span>
                    </div>
                    <Button className="w-full gap-2 group/btn" asChild>
                      <a href={`/academico/grupos/disponible?course=${course.id}`}>
                        Ver detalles
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-center gap-8">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg z-40"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Indicadores */}
        <div className="flex gap-2">
          {featuredCourses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Ir al curso ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg z-40"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
