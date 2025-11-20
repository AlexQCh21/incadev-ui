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

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-20 lg:pt-32 pb-8 sm:pb-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
          Selecciona tu Módulo
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Elige el módulo correspondiente a tu área de trabajo para acceder al sistema
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 animate-in fade-in slide-in-from-top duration-700 delay-100 px-2">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 sm:h-14 pl-10 sm:pl-12 text-sm sm:text-base border-2 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filteredCategories.map((category, index) => {
          const Icon = iconMap[category.icon] || Server;

          return (
            <Card
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 sm:hover:-translate-y-2 bg-background/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradiente de fondo */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center ${category.color} shadow-lg ring-2 sm:ring-4 ring-background group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                  </div>
                  <Badge variant="secondary" className="font-mono px-2 py-0.5 sm:px-3 sm:py-1 text-xs">
                    {category.roleCount} {category.roleCount === 1 ? 'rol' : 'roles'}
                  </Badge>
                </div>

                <CardTitle className="text-lg sm:text-xl md:text-2xl group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-1.5 sm:mt-2">
                  {category.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 p-4 sm:p-6">
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span className="font-medium">Acceder al módulo</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* No results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 sm:py-16 animate-in fade-in duration-500 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Search className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            No se encontraron módulos
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* Info section */}
      <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-2 border-dashed text-center animate-in fade-in duration-700 delay-300 px-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          ¿No encuentras tu módulo o tienes problemas para acceder?
        </p>
        <button className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-all text-sm sm:text-base">
          Contactar a soporte técnico
        </button>
      </div>

      </div>
    </div>
  );
}
