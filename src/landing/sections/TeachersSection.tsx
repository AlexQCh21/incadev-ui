import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, BookOpen, Star } from "lucide-react";

// Datos de ejemplo - En producción vendrían de la API
const teachers = [
  {
    id: 1,
    name: "Dr. Carlos Ramírez",
    subjectArea: "Desarrollo Web y Mobile",
    professionalSummary: "Experto en tecnologías JavaScript con 10 años de experiencia en desarrollo full stack y formación de equipos técnicos.",
    avatar: "/tecnologico/landing/joven-profesor-sosteniendo-un-libro-mientras-explica-el-uso-de-gafas-en-la-pared-beige.jpg",
    coursesCount: 5,
    studentsCount: 230,
    rating: 4.9,
    specialties: ["React", "Node.js", "TypeScript"]
  },
  {
    id: 2,
    name: "Mg. Ana Torres",
    subjectArea: "Ciencia de Datos",
    professionalSummary: "Científica de datos con especialización en Machine Learning y análisis predictivo. Docente universitaria con 8 años de experiencia.",
    avatar: "/tecnologico/landing/mujer-sonriente-de-tiro-medio-ensenando.jpg",
    coursesCount: 4,
    studentsCount: 180,
    rating: 4.8,
    specialties: ["Python", "Machine Learning", "SQL"]
  },
  {
    id: 3,
    name: "Lic. María Gonzáles",
    subjectArea: "Diseño UX/UI",
    professionalSummary: "Diseñadora UX/UI con experiencia en startups tecnológicas. Apasionada por crear experiencias digitales centradas en el usuario.",
    avatar: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    coursesCount: 3,
    studentsCount: 150,
    rating: 4.7,
    specialties: ["Figma", "Design Thinking", "Prototipado"]
  },
  {
    id: 4,
    name: "Ing. Roberto Silva",
    subjectArea: "DevOps y Cloud",
    professionalSummary: "Ingeniero de infraestructura cloud con certificaciones en AWS y Azure. Especialista en automatización y CI/CD.",
    avatar: "/tecnologico/landing/hombre-cansado-sentado-comodo-en-el-sofa-mientras-charla-con-sus-companeros-de-equipo.jpg",
    coursesCount: 4,
    studentsCount: 195,
    rating: 4.9,
    specialties: ["AWS", "Docker", "Kubernetes"]
  }
];

export default function TeachersSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <GraduationCap className="h-3 w-3 mr-1" />
          Nuestro Equipo
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Profesores Destacados
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Aprende de profesionales con amplia experiencia en la industria tecnológica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="group hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Avatar del profesor */}
            <div className="relative">
              <div className="aspect-square overflow-hidden bg-muted/30">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              {/* Rating badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 backdrop-blur gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {teacher.rating}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{teacher.name}</CardTitle>
              <CardDescription className="text-sm">
                {teacher.subjectArea}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Resumen profesional */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {teacher.professionalSummary}
              </p>

              {/* Especialidades */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-lg font-bold">{teacher.coursesCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cursos</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-lg font-bold">{teacher.studentsCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Estudiantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
