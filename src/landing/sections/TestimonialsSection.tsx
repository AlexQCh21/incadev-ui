import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

// Datos de ejemplo - En producción vendrían de la API (survey_responses agregados)
const testimonials = [
  {
    id: 1,
    name: "Juan Pérez",
    role: "Egresado - Desarrollo Web",
    avatar: "/tecnologico/landing/hombre-cansado-sentado-comodo-en-el-sofa-mientras-charla-con-sus-companeros-de-equipo.jpg",
    rating: 5,
    comment: "Excelente plataforma educativa. Los profesores son muy capacitados y el contenido está actualizado. Logré conseguir trabajo como desarrollador frontend 2 meses después de graduarme.",
    course: "Desarrollo Web Full Stack"
  },
  {
    id: 2,
    name: "María Gonzáles",
    role: "Egresada - Data Science",
    avatar: "/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg",
    rating: 5,
    comment: "INCADEV cambió mi carrera profesional. El enfoque práctico y los proyectos reales me prepararon perfectamente para el mercado laboral. Totalmente recomendado.",
    course: "Python para Análisis de Datos"
  },
  {
    id: 3,
    name: "Carlos Ramos",
    role: "Egresado - UX/UI Design",
    avatar: "/tecnologico/landing/joven-profesor-sosteniendo-un-libro-mientras-explica-el-uso-de-gafas-en-la-pared-beige.jpg",
    rating: 5,
    comment: "La mejor inversión que pude hacer en mi educación. El soporte de los profesores es excepcional y la comunidad de estudiantes es muy colaborativa.",
    course: "Diseño UX/UI Profesional"
  },
  {
    id: 4,
    name: "Ana Torres",
    role: "Estudiante Activa",
    avatar: "/tecnologico/landing/mujer-sonriente-de-tiro-medio-ensenando.jpg",
    rating: 5,
    comment: "Llevo 6 semanas en el curso y estoy impresionada con la calidad del material y la atención personalizada. Los grupos reducidos permiten un aprendizaje efectivo.",
    course: "Desarrollo Web Full Stack"
  },
  {
    id: 5,
    name: "Roberto Silva",
    role: "Egresado - DevOps",
    avatar: "/tecnologico/landing/persona-que-realiza-terapia-de-psicologo-en-linea.jpg",
    rating: 4,
    comment: "Plataforma muy profesional con excelente contenido. Me ayudó a obtener certificaciones importantes y mejorar mis habilidades técnicas significativamente.",
    course: "DevOps y Cloud Computing"
  },
  {
    id: 6,
    name: "Lucía Mendoza",
    role: "Egresada - Data Analytics",
    avatar: "/tecnologico/landing/chica-joven-estudiante-aislada-en-la-pared-gris-sonriendo-la-camara-presionando-la-computadora-portatil-contra-el-pecho-con-mochila-lista-para-ir-estudios-comenzar-un-nu.jpg",
    rating: 5,
    comment: "Los instructores realmente se preocupan por tu aprendizaje. El enfoque hands-on y los proyectos prácticos son lo que más valoro del programa.",
    course: "Python para Análisis de Datos"
  }
];

export default function TestimonialsSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
          Testimonios
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Lo Que Dicen Nuestros Estudiantes
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conoce las experiencias de quienes ya transformaron su carrera con INCADEV
        </p>
      </div>

      {/* Grid de testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              {/* Icono de comillas */}
              <div className="absolute top-4 right-4 text-primary/10">
                <Quote className="h-12 w-12" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < testimonial.rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Comentario */}
              <p className="text-sm text-muted-foreground mb-6 line-clamp-4 italic">
                "{testimonial.comment}"
              </p>

              {/* Información del estudiante */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-primary truncate">
                    {testimonial.course}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">98%</div>
          <p className="text-sm text-muted-foreground">Satisfacción</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">500+</div>
          <p className="text-sm text-muted-foreground">Graduados</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">4.9</div>
          <p className="text-sm text-muted-foreground">Rating Promedio</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">85%</div>
          <p className="text-sm text-muted-foreground">Tasa de Empleo</p>
        </div>
      </div>
    </div>
  );
}
