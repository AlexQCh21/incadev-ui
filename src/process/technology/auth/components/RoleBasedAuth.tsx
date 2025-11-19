"use client";

import { useState } from "react";
import { RoleSelector } from "./RoleSelector";
import { RoleLoginForm } from "./RoleLoginForm";
import { ModeToggle } from "@/components/core/ModeToggle";
import { ArrowLeft } from "lucide-react";
import type { Role } from "@/types/roles";

/**
 * Componente principal de autenticación basada en roles
 * Maneja el flujo de selección de rol y login
 */
export function RoleBasedAuth() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-muted/20 relative overflow-hidden my-6">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header con logo y controles */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 h-10 transition-transform hover:scale-105">
              <img
                src="/ISOLOGOTIPO_HORIZONTAL.svg"
                alt="INCADEV"
                className="h-full w-auto"
              />
            </a>

            {/* Controles */}
            <div className="flex items-center gap-3">
              {selectedRole && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/50 hover:bg-muted text-foreground transition-all hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Cambiar rol</span>
                </button>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="pt-16 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {!selectedRole ? (
            <RoleSelector onRoleSelect={handleRoleSelect} />
          ) : (
            <RoleLoginForm role={selectedRole} onBack={handleBack} />
          )}
        </div>
      </div>

    </div>
  );
}
