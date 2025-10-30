"use client"
import React from "react";
import { ModeToggle } from '@/components/core/ModeToggle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold">Incadev</h1>
          <p className="text-muted-foreground">Instituto de Capacitación y Desarrollo Virtual</p>
        </div>
        <ModeToggle />
      </header>

      <section className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">Nuevos Cursos Disponibles</Badge>
        <h2 className="text-4xl font-bold mb-4">Capacitación Virtual de Calidad</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Desarrolla tus habilidades con nuestros cursos virtuales diseñados para el éxito profesional.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Explorar Cursos</Button>
          <Button variant="outline" size="lg">Contactar</Button>
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Nuestros Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Capacitación Online</CardTitle>
              <CardDescription>Cursos en vivo y grabados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accede a contenido de calidad desde cualquier lugar del mundo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desarrollo Profesional</CardTitle>
              <CardDescription>Mejora tus habilidades</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Programas diseñados para el crecimiento profesional continuo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificaciones</CardTitle>
              <CardDescription>Valida tus conocimientos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Obtén certificados reconocidos en la industria.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Recibe más información</CardTitle>
            <CardDescription>Prueba los estilos del formulario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" placeholder="Ingresa tu nombre" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </div>
            <Button className="w-full">Enviar solicitud</Button>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© 2024 Incadev. Todos los derechos reservados.</p>
        <div className="mt-4">
          <ModeToggle />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;