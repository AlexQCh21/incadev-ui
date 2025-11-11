import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5">
      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center p-4 pt-32">
        <Card className="w-full max-w-md shadow-lg border-muted">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="flex justify-center mb-2">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${selectedRole?.color || "from-primary to-primary"}`}>
                <RoleIcon className="h-9 w-9 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {selectedRole?.name || "Procesos Tecnológicos"}
            </CardTitle>
            <CardDescription className="text-base">
              {requires2FA
                ? "Ingresa tu código de autenticación de dos factores"
                : "Ingresa tus credenciales para acceder"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={onSubmit}
            >
              <FieldGroup>
                {children}

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
