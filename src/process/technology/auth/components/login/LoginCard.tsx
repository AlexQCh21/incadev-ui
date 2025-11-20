import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Field } from "@/components/ui/field"
import { IconLoader2 } from "@tabler/icons-react"

interface TechRole {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface LoginCardProps {
  selectedRole: TechRole | undefined
  roleIcon: React.ComponentType<{ className?: string }>
  requires2FA: boolean
  isSubmitting: boolean
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
}

export function LoginCard({
  selectedRole,
  roleIcon: RoleIcon,
  requires2FA,
  isSubmitting,
  children,
  onSubmit
}: LoginCardProps) {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-10 pt-20 sm:pt-24 md:pt-32">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Formulario - Columna izquierda */}
            <form className="p-4 sm:p-6 md:p-8" onSubmit={onSubmit}>
              <FieldGroup>
                {/* Header del formulario */}
                <div className="flex flex-col items-center gap-2 text-center mb-4 sm:mb-6">
                  <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br ${selectedRole?.color || "from-primary to-primary"} mb-2`}>
                    <RoleIcon className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {requires2FA ? "Verificación 2FA" : "Bienvenido"}
                  </h1>
                  <p className="text-muted-foreground text-balance text-sm sm:text-base">
                    {requires2FA
                      ? "Ingresa tu código de verificación"
                      : `Inicia sesión como ${selectedRole?.name || "usuario"}`}
                  </p>
                </div>

                {/* Campos del formulario (children) */}
                {children}

                {/* Botón de envío */}
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
                        {requires2FA ? "Verificando..." : "Iniciando sesión..."}
                      </>
                    ) : (
                      requires2FA ? "Verificar código" : "Iniciar sesión"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            {/* Imagen - Columna derecha (solo visible en desktop) */}
            <div className="bg-muted relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
              <img
                src="/ISOLOGOTIPO_VERTICAL.svg"
                alt="INCADEV Tecnológico"
                className="absolute inset-0 h-full w-full object-contain p-12 lg:p-16 dark:brightness-[0.9]"
              />
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  INCADEV Tecnológico
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Sistema de gestión de procesos tecnológicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer con términos */}
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
  )
}
