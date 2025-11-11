"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Shield, LifeBuoy, Server, ShieldCheck, BarChart3, Code,
  ClipboardList, UserCheck, Search, Users, DollarSign, Eye,
  UserPlus, TrendingUp, Megaphone, Presentation, GraduationCap,
  BookOpen, Heart, FileText, Calendar, CalendarCheck, Repeat,
  ArrowLeft, Loader2, AlertCircle, CheckCircle2, ArrowRight
} from "lucide-react";
import type { Role } from "@/types/roles";

// Mapeo de iconos
const iconMap: Record<string, any> = {
  Shield, LifeBuoy, Server, ShieldCheck, BarChart3, Code,
  ClipboardList, UserCheck, Search, Users, DollarSign, Eye,
  UserPlus, TrendingUp, Megaphone, Presentation, GraduationCap,
  BookOpen, Heart, FileText, Calendar, CalendarCheck, Repeat
};

interface RoleLoginFormProps {
  role: Role;
  onBack: () => void;
}

export function RoleLoginForm({ role, onBack }: RoleLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const Icon = iconMap[role.icon] || Shield;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // Simular llamada a API - reducido a 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aquí iría la lógica real de autenticación
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, role: role.id })
      // });

      setSuccess(true);
      setLoading(false);

      // Redirigir según el rol
      setTimeout(() => {
        if (role.dashboardPath) {
          window.location.href = role.dashboardPath;
        } else {
          // Dashboard por defecto si no tiene ruta específica
          window.location.href = '/dashboard';
        }
      }, 500);

    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right duration-500">
      <Card className="shadow-2xl border-2 bg-background/90 backdrop-blur-md overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border-b">
          <div className="flex items-center gap-5 mb-6">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ${role.color} shadow-xl ring-4 ring-primary/10`}>
              <Icon className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">
                {role.displayName}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {role.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="font-mono px-4 py-1.5 text-xs">
            {role.name}
          </Badge>
        </div>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-semibold text-foreground">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@incadev.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-semibold text-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-12 text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="text-sm px-0"
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-500 text-green-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Inicio de sesión exitoso. Redirigiendo...
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-14 rounded-xl font-bold text-base transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Ingresando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión como {role.displayName}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              disabled={loading || success}
              className="w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 bg-muted/50 hover:bg-muted text-foreground border-2 border-transparent hover:border-muted-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Cambiar de rol</span>
            </button>
          </form>

          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              ¿No tienes una cuenta?{" "}
              <button className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-all">
                Solicitar acceso
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
