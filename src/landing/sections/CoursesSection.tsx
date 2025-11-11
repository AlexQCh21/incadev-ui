import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";

// Datos de ejemplo - En producción vendrían de la API
const courses = [
  {
    id: 1,
    name: "Desarrollo Web Full Stack",
    description: "Aprende a crear aplicaciones web completas con tecnologías modernas",
    price: 350,
    duration: "12 semanas",
    students: 45,
    rating: 4.8,
    modules: 8,
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    level: "Intermedio",
    status: "available"
  },
  {
    id: 2,
    name: "Python para Análisis de Datos",
    description: "Domina Python y sus librerías para análisis y visualización de datos",
    price: 300,
    duration: "10 semanas",
    students: 38,
    rating: 4.9,
    modules: 6,
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    level: "Principiante",
    status: "available"
  },
  {
    id: 3,
    name: "Diseño UX/UI Profesional",
    description: "Crea experiencias digitales excepcionales centradas en el usuario",
    price: 280,
    duration: "8 semanas",
    students: 52,
    rating: 4.7,
    modules: 7,
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    level: "Intermedio",
    status: "available"
  }
];

export default function CoursesSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <BookOpen className="h-3 w-3 mr-1" />
          Cursos Certificados
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Cursos Disponibles
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubre nuestros cursos diseñados por expertos y comienza tu camino en tecnología
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {courses.map((course) => (
          <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            {/* Imagen del curso */}
            <div className="relative h-48 overflow-hidden bg-muted/30">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 backdrop-blur">
                  {course.level}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">{course.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
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
              <div className="mt-auto space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    S/ {course.price}
                  </span>
                  <span className="text-sm text-muted-foreground">por curso</span>
                </div>
                <Button className="w-full gap-2" asChild>
                  <a href={`/academico/grupos/disponible?course=${course.id}`}>
                    Ver detalles
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ver todos los cursos */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="gap-2" asChild>
          <a href="/academico/grupos/disponible">
            Ver todos los cursos
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
