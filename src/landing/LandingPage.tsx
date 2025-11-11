"use client";

import React from "react";

// Section imports
import HeroSection from "./sections/HeroSection";
import CoursesSection from "./sections/CoursesSection";
import GroupsSection from "./sections/GroupsSection";
import TeachersSection from "./sections/TeachersSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";

// Component imports
import ChatbotButton from "./components/ChatbotButton";

/**
 * LandingPage Component
 * Diseño limpio estilo Platzi con secciones claramente diferenciadas
 * y espaciado generoso entre cada bloque de contenido
 */
const LandingPage: React.FC = () => {
  return (
    <>
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section - Fondo con gradiente sutil */}
        <section
          id="hero"
          className="relative bg-linear-to-b from-primary/5 via-background to-background"
        >
          <HeroSection />
        </section>

        {/* Courses Section - Cursos disponibles */}
        <section
          id="courses"
          className="relative bg-background py-16 md:py-20 lg:py-24"
        >
          <CoursesSection />
        </section>

        {/* Groups Section - Grupos abiertos */}
        <section
          id="groups"
          className="relative bg-muted/30 py-16 md:py-20 lg:py-24"
        >
          <GroupsSection />
        </section>

        {/* Teachers Section - Profesores destacados */}
        <section
          id="teachers"
          className="relative bg-background py-16 md:py-20 lg:py-24"
        >
          <TeachersSection />
        </section>

        {/* Testimonials Section - Reseñas de estudiantes */}
        <section
          id="testimonials"
          className="relative bg-muted/30 py-16 md:py-20 lg:py-24"
        >
          <TestimonialsSection />
        </section>

        {/* About Section - Acerca de nosotros */}
        <section
          id="about"
          className="relative bg-background py-16 md:py-20 lg:py-24"
        >
          <AboutSection />
        </section>

        {/* Contact Section - Formulario de contacto */}
        <section
          id="contact"
          className="relative bg-muted/30 py-16 md:py-20 lg:py-24"
        >
          <ContactSection />
        </section>
      </main>

      {/* Floating Chatbot Button */}
      <ChatbotButton />
    </>
  );
};

export default LandingPage;
