import { useState } from "react"
import { useRecoveryEmail } from "../../hooks/useRecoveryEmail"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Mail, Trash2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"

interface RecoveryEmailManagerProps {
  recoveryEmail?: string
  isVerified?: boolean
  token: string
  onRemove?: () => void
  onAdd?: () => void
}

/**
 * Componente para gestionar el email de recuperación
 * Muestra el email actual y permite eliminarlo
 */
export function RecoveryEmailManager({
  recoveryEmail,
  isVerified = false,
  token,
  onRemove,
  onAdd,
}: RecoveryEmailManagerProps) {
  const [showDialog, setShowDialog] = useState(false)
  const { loading, error, success, removeRecoveryEmail, clearMessages } = useRecoveryEmail()

  const handleRemove = async () => {
    clearMessages()
    const result = await removeRecoveryEmail(token)

    if (result?.success) {
      setTimeout(() => {
        setShowDialog(false)
        if (onRemove) {
          onRemove()
        }
      }, 1500)
    }
  }

  if (!recoveryEmail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email de Recuperación
          </CardTitle>
          <CardDescription>
            No tienes un email de recuperación configurado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Agrega un email alternativo para recuperar tu cuenta en caso de olvidar tu contraseña.
          </p>
          {onAdd && (
            <Button onClick={onAdd} variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Agregar Email de Recuperación
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email de Recuperación
        </CardTitle>
        <CardDescription>
          Gestiona tu email de recuperación de cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{recoveryEmail}</p>
              <div className="flex items-center gap-1 mt-1">
                {isVerified ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Verificado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span className="text-xs text-amber-600">Pendiente de verificación</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={loading}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar email de recuperación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará <strong>{recoveryEmail}</strong> como tu email de recuperación.
                  No podrás usar este email para recuperar tu cuenta en el futuro.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Email de recuperación eliminado exitosamente.
                  </AlertDescription>
                </Alert>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Este email se puede usar para recuperar tu cuenta si olvidas tu contraseña.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
