"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState } from "react"
import { IconEye, IconEyeOff, IconLoader2, IconShieldCheck, IconMail, IconLock, IconUserCircle, IconLifebuoy, IconServer, IconShield, IconChartBar, IconCode, IconArrowLeft } from "@tabler/icons-react"
import { z } from "zod"
import { routes } from "@/process/technology/technology-site"
import { config } from "@/config/technology-config"
import { ModeToggle } from "@/components/core/ModeToggle"

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

  code: z
    .string()
    .optional(),
});

// Definición de roles del módulo tecnológico
const TECH_ROLES = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acceso completo al sistema",
    icon: "IconShieldCheck",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "support",
    name: "Soporte",
    description: "Asistencia técnica y atención",
    icon: "IconLifebuoy",
    color: "from-green-500 to-green-600",
  },
  {
    id: "infrastructure",
    name: "Infraestructura",
    description: "Gestión de infraestructura TI",
    icon: "IconServer",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "security",
    name: "Seguridad",
    description: "Seguridad y protección de datos",
    icon: "IconShield",
    color: "from-red-500 to-red-600",
  },
  {
    id: "academic_analyst",
    name: "Analista Académico",
    description: "Análisis y reportes académicos",
    icon: "IconChartBar",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "web",
    name: "Desarrollo Web",
    description: "Desarrollo y mantenimiento web",
    icon: "IconCode",
    color: "from-cyan-500 to-cyan-600",
  },
];

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState<{email: string, password: string, role: string} | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showLoginForm, setShowLoginForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: selectedRole || "admin",
      code: "",
    },
  })

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setValue("role", roleId);
    setShowLoginForm(true);
  }

  const handleBackToRoles = () => {
    setShowLoginForm(false);
    setSelectedRole(null);
    setRequires2FA(false);
    setLoginCredentials(null);
  }

  // Mapeo de iconos
  const iconMap: Record<string, any> = {
    IconShieldCheck,
    IconLifebuoy,
    IconServer,
    IconShield,
    IconChartBar,
    IconCode,
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Si ya se requiere 2FA, llamar al endpoint de verificación
      if (requires2FA && loginCredentials) {
        if (!data.code || data.code.trim() === "") {
          toast.error("Código requerido", {
            description: "Por favor, ingresa el código de autenticación de dos factores.",
          });
          return;
        }

        const response = await fetch(`${config.apiUrl}${config.endpoints.twoFactor.verifyLogin}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginCredentials.email,
            password: loginCredentials.password,
            code: data.code,
            role: loginCredentials.role,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();

          // Guardar token y usuario en localStorage - según ind.txt: { success, message, data: { user, token } }
          if (responseData.success && responseData.data) {
            localStorage.setItem("token", responseData.data.token);
            localStorage.setItem("user", JSON.stringify(responseData.data.user));

            toast.success("¡Autenticación exitosa!", {
              description: "Verificación 2FA completada. Redirigiendo...",
            });

            setTimeout(() => {
              window.location.href = routes.dashboard.index;
            }, 1500);
          }
        } else {
          const errorData = await response.json();
          toast.error("Código incorrecto", {
            description: errorData.message || "El código 2FA ingresado no es válido.",
          });
        }
        return;
      }

      // Primera llamada: login normal
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

      if (response.ok) {
        const responseData = await response.json();

        // Verificar si requiere 2FA
        if (responseData.requires_2fa) {
          setRequires2FA(true);
          setLoginCredentials({
            email: data.email,
            password: data.password,
            role: data.role,
          });

          toast.info("Verificación 2FA requerida", {
            description: "Por favor, ingresa tu código de autenticación de dos factores.",
          });
          return;
        }

        // Login exitoso sin 2FA - según ind.txt: { success, message, data: { user, token } }
        if (responseData.success && responseData.data) {
          localStorage.setItem("token", responseData.data.token);
          localStorage.setItem("user", JSON.stringify(responseData.data.user));

          toast.success("¡Inicio de sesión exitoso!", {
            description: "Redirigiendo a tu dashboard.",
          });

          setTimeout(() => {
            window.location.href = routes.dashboard.index;
          }, 1500);
          return;
        }
      }

      // Manejar errores - según ind.txt puede responder con { success: false, message: "..." }
      const errorData = await response.json();

      // Verificar si el error indica que se requiere 2FA
      if (errorData.requires_2fa) {
        setRequires2FA(true);
        setLoginCredentials({
          email: data.email,
          password: data.password,
          role: data.role,
        });

        toast.info("Verificación 2FA requerida", {
          description: "Por favor, ingresa tu código de autenticación de dos factores.",
        });
        return;
      }

      // Mostrar el mensaje de error principal
      if (errorData.success === false && errorData.message) {
        toast.error("Error en el inicio de sesión", {
          description: errorData.message,
          duration: 5000,
        });
      } else {
        toast.error("Error en el inicio de sesión", {
          description: errorData.message || "Credenciales inválidas.",
          duration: 5000,
        });
      }

      // Mostrar errores de validación si existen (para el caso de role inválido)
      if (errorData.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => {
              toast.error(`Error en ${field}`, {
                description: message,
                duration: 5000,
              });
            });
          }
        });
      }

    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Error de conexión", {
        description: "Hubo un error al conectar con el servidor.",
      });
    }
  }

  // Si no se ha seleccionado un rol, mostrar la selección de roles
  if (!showLoginForm) {
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
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <IconShieldCheck className="h-11 w-11 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Procesos Tecnológicos</h1>
            <p className="text-muted-foreground text-lg">
              Selecciona tu rol para iniciar sesión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TECH_ROLES.map((role, index) => {
              const Icon = iconMap[role.icon] || IconShieldCheck;

              return (
                <Card
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-background/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-500 relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-4 shadow-lg ring-4 ring-background group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl transition-colors">
                      {role.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed mt-2">
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

  // Si se ha seleccionado un rol, mostrar el formulario de login
  const selectedRoleData = TECH_ROLES.find(r => r.id === selectedRole);
  const RoleIcon = selectedRoleData ? iconMap[selectedRoleData.icon] : IconShieldCheck;

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
      <div className="flex min-h-screen items-center justify-center p-4 pt-32">
        <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="flex justify-center mb-2">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${selectedRoleData?.color || "from-primary to-primary"}`}>
              <RoleIcon className="h-9 w-9 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{selectedRoleData?.name || "Procesos Tecnológicos"}</CardTitle>
          <CardDescription className="text-base">
            {requires2FA
              ? "Ingresa tu código de autenticación de dos factores"
              : "Ingresa tus credenciales para acceder"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
          >
            <FieldGroup>
              {!requires2FA && (
                <>
                  <Field>
                    <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                    <div className="relative">
                      <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-10"
                        {...register("email")}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
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
                        {showPassword ? (
                          <IconEyeOff className="h-4 w-4" />
                        ) : (
                          <IconEye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToRoles}
                    className="text-sm -mt-2"
                  >
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Cambiar rol
                  </Button>
                </>
              )}

              {requires2FA && (
                <>
                  <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800/50">
                    <IconShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      Autenticación de dos factores activada
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="code">Código de Autenticación (6 dígitos)</FieldLabel>
                    <Input
                      id="code"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      {...register("code")}
                      disabled={isSubmitting}
                      autoFocus
                      className="text-center text-2xl tracking-widest"
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Ingresa el código generado por tu aplicación de autenticación
                    </p>
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRequires2FA(false);
                      setLoginCredentials(null);
                      setValue("code", "");
                    }}
                    className="text-sm"
                  >
                    ← Volver al inicio de sesión
                  </Button>
                </>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      {requires2FA ? "Verificando código..." : "Iniciando sesión..."}
                    </>
                  ) : (
                    requires2FA ? "Verificar código" : "Iniciar sesión"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
