"use client"
import React, { useState, useEffect } from "react";
import { ModeToggle } from '@/components/core/ModeToggle';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home, BookOpen, Users, GraduationCap, MessageCircle,
  Info, Phone, Menu
} from "lucide-react";

interface NavLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  sectionId: string;
}

const navLinks: NavLink[] = [
  { id: "inicio", label: "Inicio", icon: <Home className="h-4 w-4" />, sectionId: "hero" },
  { id: "cursos", label: "Cursos", icon: <BookOpen className="h-4 w-4" />, sectionId: "courses" },
  { id: "grupos", label: "Grupos", icon: <Users className="h-4 w-4" />, sectionId: "groups" },
  { id: "profesores", label: "Profesores", icon: <GraduationCap className="h-4 w-4" />, sectionId: "teachers" },
  { id: "testimonios", label: "Testimonios", icon: <MessageCircle className="h-4 w-4" />, sectionId: "testimonials" },
  { id: "nosotros", label: "Nosotros", icon: <Info className="h-4 w-4" />, sectionId: "about" },
  { id: "contacto", label: "Contacto", icon: <Phone className="h-4 w-4" />, sectionId: "contact" }
];

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Manejar scroll para ocultar/mostrar navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solo ocultar si NO estamos en scroll automático y scrolleamos hacia abajo
      if (!isAutoScrolling && currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (!isAutoScrolling) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Detectar sección activa
      const sections = navLinks.map(link => link.sectionId);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isAutoScrolling]);

  // Función para navegar suavemente a una sección
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Altura del navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      // Marcar que estamos en scroll automático
      setIsAutoScrolling(true);
      setIsVisible(true); // Asegurar que el navbar esté visible

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Resetear el flag después de que termine la animación (aproximadamente 1 segundo)
      setTimeout(() => {
        setIsAutoScrolling(false);
      }, 1000);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="h-16 focus:outline-none focus:ring-2 focus:ring-primary rounded block"
            >
              <img
                src="/ISOLOGOTIPO_HORIZONTAL.svg"
                alt="INCADEV - Instituto de Capacitación y Desarrollo Virtual"
                className="h-full w-auto"
              />
            </a>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.sectionId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.sectionId
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/login-roles">Ingresar</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/academico/register">Registrarse</a>
              </Button>
            </div>
            <ModeToggle />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Navegación
                    </h3>
                    {navLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => scrollToSection(link.sectionId)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeSection === link.sectionId
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/login-roles">Ingresar</a>
                      </Button>
                      <Button className="w-full" asChild>
                        <a href="/academico/register">Registrarse</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}