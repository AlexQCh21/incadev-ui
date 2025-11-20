"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as TablerIcons from "@tabler/icons-react";

// Destructure icons
const {
  IconShieldCheck,
  IconLifebuoy,
  IconServer,
  IconShield,
  IconChartBar,
  IconCode,
  IconClipboardList,
  IconUserCheck,
  IconSearch,
  IconUsers,
  IconDollarSign,
  IconEye,
  IconUserPlus,
  IconTrendingUp,
  IconMegaphone,
  IconPresentation,
  IconGraduationCap,
  IconBookOpen,
  IconHeart,
  IconFileText,
  IconCalendar,
  IconCalendarCheck,
  IconRepeat,
  IconLoader2,
  IconMail,
  IconLock,
  IconEyeOff,
  IconArrowLeft,
  IconHome,
  IconLayoutGrid,
} = TablerIcons;

const EyeIcon = IconEye;

// Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

// Config
import { getRolesByModule, getModuleById } from "@/config/auth/module-mapping";
import { getDashboardRoute } from "@/config/dashboard-routes";
import type { Role } from "@/types/roles";
import { toast } from "sonner";
import { config } from "@/config/technology-config";

// Icon mapping
const iconMap: Record<string, any> = {
  Shield: IconShieldCheck,
  LifeBuoy: IconLifebuoy,
  Server: IconServer,
  ShieldCheck: IconShieldCheck,
  BarChart3: IconChartBar,
  Code: IconCode,
  ClipboardList: IconClipboardList,
  UserCheck: IconUserCheck,
  Search: IconSearch,
  Users: IconUsers,
  DollarSign: IconDollarSign,
  Eye: IconEye,
  UserPlus: IconUserPlus,
  TrendingUp: IconTrendingUp,
  Megaphone: IconMegaphone,
  Presentation: IconPresentation,
  GraduationCap: IconGraduationCap,
  BookOpen: IconBookOpen,
  Heart: IconHeart,
  FileText: IconFileText,
  Calendar: IconCalendar,
  CalendarCheck: IconCalendarCheck,
  Repeat: IconRepeat,
};

// Form Schema
const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Por favor, ingresa una dirección de correo válida.",
    })
    .min(1, {
      message: "El correo electrónico es obligatorio.",
    }),

  password: z
    .string()
    .min(1, {
      message: "La contraseña es obligatoria.",
    }),

  role: z
    .string()
    .min(1, {
      message: "El rol es obligatorio.",
    }),

  code: z.string().optional(),
});

type LoginFormData = z.infer<typeof FormSchema>;

interface UniversalLoginProps {
  moduleId: string;
}

export function UniversalLogin({ moduleId }: UniversalLoginProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<any>(null);
  const [code2FA, setCode2FA] = useState<string[]>(["", "", "", "", "", ""]);

  const moduleInfo = getModuleById(moduleId);
  const moduleRoles = getRolesByModule(moduleId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: selectedRole || "",
      code: "",
    },
  });

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role) {
          const dashboardRoute = getDashboardRoute(user.role);
          window.location.href = dashboardRoute;
        }
      } catch (error) {
        console.error("[UniversalLogin] Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setValue("role", roleId);
    setShowLoginForm(true);
  };

  const handleBackToRoles = () => {
    setShowLoginForm(false);
    setSelectedRole(null);
    setRequires2FA(false);
    setLoginCredentials(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (requires2FA && loginCredentials) {
        // Verificar 2FA
        const code = code2FA.join("");
        if (code.length !== 6) {
          toast.error("Por favor ingresa el código de 6 dígitos");
          return;
        }

        const response = await fetch(`${config.apiUrl}${config.endpoints.auth.verify2FA}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...loginCredentials,
            code,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));

          toast.success("Inicio de sesión exitoso");
          const dashboardRoute = getDashboardRoute(data.role);
          window.location.href = dashboardRoute;
        } else {
          toast.error(result.message || "Código 2FA inválido");
        }
      } else {
        // Login normal
        const response = await fetch(`${config.apiUrl}${config.endpoints.auth.login}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            role: data.role,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (result.data.requires_2fa) {
            setRequires2FA(true);
            setLoginCredentials({
              email: data.email,
              password: data.password,
              role: data.role,
            });
            toast.info("Por favor ingresa tu código de autenticación de dos factores");
          } else {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));

            toast.success("Inicio de sesión exitoso");
            const dashboardRoute = getDashboardRoute(data.role);
            window.location.href = dashboardRoute;
          }
        } else {
          toast.error(result.message || "Error al iniciar sesión");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión. Por favor intenta nuevamente.");
    }
  };

  const handle2FACodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code2FA];
    newCode[index] = value;
    setCode2FA(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  if (!moduleInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Módulo no encontrado</p>
      </div>
    );
  }

  // Selector de roles
  if (!showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-20 lg:pt-32 pb-8 sm:pb-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br ${moduleInfo.gradient}`}>
                <IconShieldCheck className="h-9 w-9 sm:h-11 sm:w-11 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 px-4">{moduleInfo.name}</h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              Selecciona tu rol para iniciar sesión
            </p>

            {/* Botones de navegación */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="gap-2"
              >
                <IconHome className="h-4 w-4" />
                Inicio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/auth'}
                className="gap-2"
              >
                <IconLayoutGrid className="h-4 w-4" />
                Módulos
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
            {moduleRoles.map((role, index) => {
              const Icon = iconMap[role.icon] || IconShieldCheck;

              return (
                <Card
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 sm:hover:-translate-y-2 bg-background/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${moduleInfo.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6 relative z-10">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${moduleInfo.gradient} flex items-center justify-center ${moduleInfo.color} mb-3 sm:mb-4 shadow-lg ring-2 sm:ring-4 ring-background group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl transition-colors">{role.displayName}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm leading-relaxed mt-1.5 sm:mt-2">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Formulario de login
  const selectedRoleData = moduleRoles.find((r) => r.id === selectedRole);
  const RoleIcon = selectedRoleData ? iconMap[selectedRoleData.icon] || IconShieldCheck : IconShieldCheck;

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-10 pt-20 sm:pt-24 md:pt-32">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-4 sm:p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-4 sm:mb-6">
                  <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br ${moduleInfo.gradient} mb-2`}>
                    <RoleIcon className="h-8 w-8 sm:h-9 sm:w-9 ${moduleInfo.color}" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {requires2FA ? "Verificación 2FA" : "Bienvenido"}
                  </h1>
                  <p className="text-muted-foreground text-balance text-sm sm:text-base">
                    {requires2FA ? "Ingresa tu código de verificación" : `Inicia sesión como ${selectedRoleData?.displayName || "usuario"}`}
                  </p>
                </div>

                {!requires2FA ? (
                  <>
                    <Field>
                      <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                      <div className="relative">
                        <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="usuario@example.com"
                          className="pl-10"
                          {...register("email")}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingresa tu contraseña"
                          className="pl-10 pr-10"
                          {...register("password")}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isSubmitting}
                        >
                          {showPassword ? <IconEyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </Field>

                    <div className="flex items-center gap-2 -mt-2">
                      <Button type="button" variant="ghost" size="sm" onClick={handleBackToRoles} className="text-sm flex-1">
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Cambiar rol
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => window.location.href = '/auth'} className="text-sm">
                        <IconLayoutGrid className="mr-2 h-4 w-4" />
                        Módulos
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="text-sm">
                        <IconHome className="mr-2 h-4 w-4" />
                        Inicio
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {code2FA.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handle2FACodeChange(index, e.target.value)}
                          disabled={isSubmitting}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      ))}
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setRequires2FA(false)} className="text-sm">
                      ← Volver al inicio de sesión
                    </Button>
                  </div>
                )}

                <Field>
                  <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                    {isSubmitting ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        {requires2FA ? "Verificando..." : "Iniciando sesión..."}
                      </>
                    ) : requires2FA ? (
                      "Verificar código"
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            <div className="bg-muted relative hidden md:block">
              <div className={`absolute inset-0 bg-gradient-to-br ${moduleInfo.gradient}`} />
              <img
                src="/ISOLOGOTIPO_VERTICAL.svg"
                alt="INCADEV"
                className="absolute inset-0 h-full w-full object-contain p-12 lg:p-16 dark:brightness-[0.9]"
              />
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{moduleInfo.name}</h2>
                <p className="text-muted-foreground text-sm md:text-base">{moduleInfo.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="px-3 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Política de Privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
}
