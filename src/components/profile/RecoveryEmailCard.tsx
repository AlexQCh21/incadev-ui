import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/ui/field"
import {
  IconMail,
  IconMailCheck,
  IconTrash,
  IconRefresh,
  IconX
} from "@tabler/icons-react"

interface RecoveryEmailCardProps {
  recoveryEmail: string | undefined
  recoveryEmailVerified: boolean
  showRecoveryEmailSetup: boolean
  recoveryEmailStep: 'add' | 'verify'
  recoveryEmailInput: string
  recoveryCode: string
  processingRecovery: boolean
  onAddRecoveryEmail: () => void
  onVerifyRecoveryEmail: () => void
  onResendRecoveryCode: () => void
  onRemoveRecoveryEmail: () => void
  onRecoveryEmailInputChange: (email: string) => void
  onRecoveryCodeChange: (code: string) => void
  onShowSetup: (show: boolean) => void
  onChangeStep: (step: 'add' | 'verify') => void
}

export function RecoveryEmailCard({
  recoveryEmail,
  recoveryEmailVerified,
  showRecoveryEmailSetup,
  recoveryEmailStep,
  recoveryEmailInput,
  recoveryCode,
  processingRecovery,
  onAddRecoveryEmail,
  onVerifyRecoveryEmail,
  onResendRecoveryCode,
  onRemoveRecoveryEmail,
  onRecoveryEmailInputChange,
  onRecoveryCodeChange,
  onShowSetup,
  onChangeStep
}: RecoveryEmailCardProps) {
  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <IconMail className="h-5 w-5" />
          Email de Recuperación
        </CardTitle>
        <CardDescription className="text-sm mt-1.5">
          Email alternativo para recuperar tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {recoveryEmail && recoveryEmailVerified ? (
          <>
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <IconMailCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {recoveryEmail}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">Verificado</p>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={onRemoveRecoveryEmail}
              className="w-full"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Eliminar Email de Recuperación
            </Button>
          </>
        ) : !showRecoveryEmailSetup ? (
          <Button
            onClick={() => onShowSetup(true)}
            className="w-full"
          >
            <IconMail className="mr-2 h-4 w-4" />
            Agregar Email de Recuperación
          </Button>
        ) : recoveryEmailStep === 'add' ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  1
                </div>
                <p className="text-sm font-medium">Ingresa tu email alternativo</p>
              </div>

              <div className="space-y-2">
                <FieldLabel>Email de Recuperación</FieldLabel>
                <Input
                  type="email"
                  placeholder="recovery@example.com"
                  value={recoveryEmailInput}
                  onChange={(e) => onRecoveryEmailInputChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Debe ser diferente a tu email principal
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onAddRecoveryEmail}
                disabled={processingRecovery || !recoveryEmailInput}
                className="flex-1"
              >
                <IconMail className="mr-2 h-4 w-4" />
                {processingRecovery ? "Enviando..." : "Enviar Código"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onShowSetup(false)
                  onRecoveryEmailInputChange("")
                }}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Código enviado a <strong>{recoveryEmailInput}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  2
                </div>
                <p className="text-sm font-medium">Verifica el código</p>
              </div>

              <div className="space-y-2">
                <FieldLabel>Código de 6 dígitos</FieldLabel>
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => onRecoveryCodeChange(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Revisa tu bandeja de entrada
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={onVerifyRecoveryEmail}
                  disabled={processingRecovery || recoveryCode.length !== 6}
                  className="flex-1"
                >
                  <IconMailCheck className="mr-2 h-4 w-4" />
                  {processingRecovery ? "Verificando..." : "Verificar"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onResendRecoveryCode}
                  title="Reenviar código"
                >
                  <IconRefresh className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChangeStep('add')
                  onRecoveryCodeChange("")
                }}
                className="w-full"
              >
                ← Cambiar Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
