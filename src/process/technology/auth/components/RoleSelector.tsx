"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, LifeBuoy, Server, ShieldCheck, BarChart3, Code,
  ClipboardList, UserCheck, Search, Users, DollarSign, Eye,
  UserPlus, TrendingUp, Megaphone, Presentation, GraduationCap,
  BookOpen, Heart, FileText, Calendar, CalendarCheck, Repeat,
  ArrowRight, Search as SearchIcon
} from "lucide-react";
import { ROLE_GROUPS, type Role } from "@/types/roles";

// Mapeo de iconos
const iconMap: Record<string, any> = {
  Shield, LifeBuoy, Server, ShieldCheck, BarChart3, Code,
  ClipboardList, UserCheck, Search, Users, DollarSign, Eye,
  UserPlus, TrendingUp, Megaphone, Presentation, GraduationCap,
  BookOpen, Heart, FileText, Calendar, CalendarCheck, Repeat
};

interface RoleSelectorProps {
  onRoleSelect: (role: Role) => void;
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Filtrar roles por búsqueda
  const filteredGroups = ROLE_GROUPS.map(group => ({
    ...group,
    roles: group.roles.filter(role =>
      role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.roles.length > 0);

  // Roles a mostrar según el grupo seleccionado
  const displayGroups = selectedGroup
    ? filteredGroups.filter(g => g.id === selectedGroup)
    : filteredGroups;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Selecciona tu Rol
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Elige el rol con el que deseas iniciar sesión en el sistema INCADEV
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar rol por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-background/50 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Filtros por grupo */}
      <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedGroup(null)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            selectedGroup === null
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105 hover:shadow-md'
          }`}
        >
          Todos
        </button>
        {ROLE_GROUPS.map(group => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(group.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              selectedGroup === group.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105 hover:shadow-md'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Lista de roles por grupo */}
      <div className="space-y-12">
        {displayGroups.map((group, groupIndex) => (
          <div
            key={group.id}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${groupIndex * 100}ms` }}
          >
            <div className="space-y-2 border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-bold text-foreground">
                {group.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.roles.map((role, roleIndex) => {
                const Icon = iconMap[role.icon] || Shield;

                return (
                  <div
                    key={role.id}
                    className="group relative animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${(groupIndex * 100) + (roleIndex * 50)}ms` }}
                  >
                    <Card className="h-full bg-background/50 backdrop-blur-sm border-2 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <CardHeader className="pb-4 relative">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ${role.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <Badge variant="secondary" className="text-xs font-mono px-3 py-1">
                            {role.name}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                          {role.displayName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                          {role.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0 pb-6 relative">
                        <button
                          onClick={() => {
                            if (role.loginPath) {
                              // Redirigir a la página de login del módulo
                              window.location.href = role.loginPath;
                            } else {
                              // Usar el callback para mostrar formulario
                              onRoleSelect(role);
                            }
                          }}
                          className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-muted to-muted/50 hover:from-primary hover:to-primary/90 text-foreground hover:text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group/btn"
                        >
                          <span>Iniciar como {role.displayName}</span>
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sin resultados */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron roles
          </h3>
          <p className="text-muted-foreground">
            Intenta con otra búsqueda o selecciona un grupo diferente
          </p>
        </div>
      )}
    </div>
  );
}
