import { useState } from "react"
import { useRecoveryEmail } from "../../hooks/useRecoveryEmail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react"

interface AddRecoveryEmailFormProps {
  token: string
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Formulario para agregar un email de recuperación
 */
export function AddRecoveryEmailForm({ token, onSuccess, onCancel }: AddRecoveryEmailFormProps) {
  const [email, setEmail] = useState("")
  const { loading, error, success, addRecoveryEmail, clearMessages } = useRecoveryEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    const result = await addRecoveryEmail({ email }, token)

    if (result?.success && onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Agregar Email de Recuperación</h2>
        <p className="text-sm text-gray-600 mt-2">
          Agrega un email alternativo para recuperar tu cuenta en caso de olvidar tu contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Email de Recuperación</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="recovery-email"
              type="email"
              placeholder="correo.recuperacion@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500">
            Recibirás un código de verificación en este email.
          </p>
        </div>

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
              Email de recuperación agregado. Revisa tu correo para verificarlo.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !email}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Agregar Email"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
