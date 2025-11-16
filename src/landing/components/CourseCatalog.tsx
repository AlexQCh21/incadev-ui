import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ArrowRight,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeaturedCoursesSlider from "./FeaturedCoursesSlider";

// Datos extendidos de cursos - En producción vendrían de la API
const allCourses = [
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
    status: "available"
  },
  {
    id: 2,
    name: "Python para Análisis de Datos",
    description: "Domina Python y sus librerías para análisis y visualización de datos con pandas, numpy y matplotlib",
    price: 300,
    duration: "10 semanas",
    students: 38,
    rating: 4.9,
    modules: 6,
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    level: "Principiante",
    category: "Data Science",
    status: "available"
  },
  {
    id: 3,
    name: "Diseño UX/UI Profesional",
    description: "Crea experiencias digitales excepcionales centradas en el usuario con Figma y metodologías ágiles",
    price: 280,
    duration: "8 semanas",
    students: 52,
    rating: 4.7,
    modules: 7,
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    level: "Intermedio",
    category: "Diseño",
    status: "available"
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
    status: "available"
  },
  {
    id: 5,
    name: "Marketing Digital y SEO",
    description: "Aprende estrategias de marketing digital, SEO, SEM y analítica web para impulsar tu negocio online",
    price: 250,
    duration: "6 semanas",
    students: 67,
    rating: 4.6,
    modules: 5,
    image: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    level: "Principiante",
    category: "Marketing",
    status: "available"
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
    status: "available"
  },
  {
    id: 7,
    name: "Desarrollo de Apps Móviles",
    description: "Crea aplicaciones móviles nativas y multiplataforma con React Native y Flutter",
    price: 380,
    duration: "12 semanas",
    students: 42,
    rating: 4.7,
    modules: 9,
    image: "/tecnologico/landing/educacion-y-estudiantes-sonriente-joven-asiatica-con-mochila-y-cuadernos-posando-contra-bac-azul.jpg",
    level: "Intermedio",
    category: "Programación",
    status: "available"
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
    status: "available"
  },
  {
    id: 9,
    name: "Cloud Computing con AWS",
    description: "Domina los servicios de Amazon Web Services y aprende a desplegar aplicaciones escalables en la nube",
    price: 400,
    duration: "10 semanas",
    students: 39,
    rating: 4.8,
    modules: 8,
    image: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    level: "Intermedio",
    category: "Cloud",
    status: "available"
  }
];

const categories = ["Todas", "Programación", "Data Science", "Diseño", "Marketing", "Seguridad", "Cloud"];
const levels = ["Todos", "Principiante", "Intermedio", "Avanzado"];

export default function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Agregar estilos de animación en el cliente
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'course-catalog-animations';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Filtrar cursos
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) ||
                         course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "Todos" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Paginación
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Reset página cuando cambian los filtros
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-20 md:py-24 max-w-[1400px]">
        {/* Header con breadcrumbs */}
        <div className="flex flex-col gap-6 mb-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">
              Inicio
            </a>
            <span>/</span>
            <span className="text-foreground font-medium">Catálogo de Cursos</span>
          </nav>

          {/* Título y descripción */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              <span>{allCourses.length} Cursos Disponibles</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Catálogo de Cursos
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl">
              Descubre cursos diseñados por expertos de la industria. Aprende a tu ritmo y obtén certificados reconocidos.
            </p>
          </div>
        </div>

        {/* Slider de Cursos Destacados */}
        <div className="mb-16">
          <FeaturedCoursesSlider />
        </div>

        {/* Búsqueda y Filtros */}
        <div className="mb-12">
          {/* Búsqueda y Filtros */}
          <Card className="shadow-lg border-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda */}
                <div className="relative md:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cursos..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      handleFilterChange();
                    }}
                    className="pl-10"
                  />
                </div>

                {/* Filtro por Categoría */}
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Categoría" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filtro por Nivel */}
                <Select
                  value={selectedLevel}
                  onValueChange={(value) => {
                    setSelectedLevel(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Nivel" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contador de resultados */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{currentCourses.length}</span> de{" "}
                  <span className="font-semibold text-foreground">{filteredCourses.length}</span> cursos
                </p>
                {(search || selectedCategory !== "Todas" || selectedLevel !== "Todos") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("Todas");
                      setSelectedLevel("Todos");
                      setCurrentPage(1);
                    }}
                    className="text-xs"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Cursos */}
        {currentCourses.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-6 mb-4">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Intenta ajustar tus filtros o realiza una búsqueda diferente para encontrar más resultados
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Todas");
                  setSelectedLevel("Todos");
                  setCurrentPage(1);
                }}
              >
                Mostrar todos los cursos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course, index) => (
                <Card
                  key={course.id}
                  className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border-muted/50"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Imagen del curso */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      <Button className="w-full gap-2 group/btn" asChild>
                        <a href={`/academico/grupos/disponible?course=${course.id}`}>
                          Ver detalles
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <Card className="shadow-lg border-muted/50 mt-8">
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                  <div className="text-sm text-muted-foreground">
                    Página <span className="font-semibold text-foreground">{currentPage}</span> de{" "}
                    <span className="font-semibold text-foreground">{totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>

                    {/* Números de página */}
                    <div className="hidden sm:flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-9"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
