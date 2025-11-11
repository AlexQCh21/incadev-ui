import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="container mx-auto px-2 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Contenido */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="h-4 w-4" />
              Plataforma educativa certificada
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              La plataforma de tecnología de{" "}
              <span className="text-primary">INCADEV</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Más de 15 cursos certificados con instructores expertos.
              Aprende a tu ritmo y alcanza tus metas profesionales.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Users className="h-5 w-5" />
                <span className="text-2xl font-bold">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Estudiantes activos</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 text-primary mb-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-2xl font-bold">15+</span>
              </div>
              <p className="text-sm text-muted-foreground">Cursos disponibles</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Award className="h-5 w-5" />
                <span className="text-2xl font-bold">100%</span>
              </div>
              <p className="text-sm text-muted-foreground">Certificación</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="gap-2" asChild>
              <a href="/academico/grupos/disponible">
                Explorar Cursos
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#contacto">Contáctanos</a>
            </Button>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            <img
              src="/tecnologico/landing/educacion-y-estudiantes-mujer-asiatica-feliz-sosteniendo-cuadernos-y-riendo-sonriendo-la-camara-disfruta-de-goi.jpg"
              alt="Estudiante aprendiendo con INCADEV"
              className="w-full h-auto rounded-2xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
