"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Server, ClipboardList, Users, Megaphone, GraduationCap,
  Heart, Calendar, Search, ArrowRight
} from "lucide-react";
import { MODULE_CATEGORIES, type ModuleCategory } from "@/types/module-categories";
import { ModeToggle } from "@/components/core/ModeToggle";
import { getDashboardRoute, hasConfiguredRoute, DEFAULT_DASHBOARD_ROUTE } from "@/config/dashboard-routes";

// Mapeo de iconos
const iconMap: Record<string, any> = {
  Server, ClipboardList, Users, Megaphone, GraduationCap, Heart, Calendar
};

export function GroupCategorySelector() {
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role) {
          // Get dashboard route for any role from any module
          const dashboardRoute = getDashboardRoute(user.role);

          // Log warning if role is not configured
          if (!hasConfiguredRoute(user.role)) {
            console.warn(`[GroupCategorySelector] Rol "${user.role}" no tiene ruta configurada. Usando ruta por defecto.`);
          }

          window.location.href = dashboardRoute;
        }
      } catch (error) {
        // If there's an error parsing user data, clear the session
        console.error("[GroupCategorySelector] Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const filteredCategories = MODULE_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCategoryClick = (category: ModuleCategory) => {
    window.location.href = category.loginPath;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/ISOLOGOTIPO_VERTICAL.svg"
                alt="INCADEV"
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">INCADEV</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
              </div>
            </a>

            {/* Theme Toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Selecciona tu Módulo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Elige el módulo correspondiente a tu área de trabajo para acceder al sistema
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-top duration-700 delay-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 text-base border-2 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => {
          const Icon = iconMap[category.icon] || Server;

          return (
            <Card
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-background/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradiente de fondo */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center ${category.color} shadow-lg ring-4 ring-background group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <Badge variant="secondary" className="font-mono px-3 py-1">
                    {category.roleCount} {category.roleCount === 1 ? 'rol' : 'roles'}
                  </Badge>
                </div>

                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed mt-2">
                  {category.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span className="font-medium">Acceder al módulo</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* No results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16 animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            No se encontraron módulos
          </h3>
          <p className="text-muted-foreground">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* Info section */}
      <div className="mt-16 pt-12 border-t-2 border-dashed text-center animate-in fade-in duration-700 delay-300">
        <p className="text-sm text-muted-foreground mb-4">
          ¿No encuentras tu módulo o tienes problemas para acceder?
        </p>
        <button className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-all text-base">
          Contactar a soporte técnico
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 INCADEV. Todos los derechos reservados.
        </p>
      </footer>
      </div>
    </div>
  );
}
