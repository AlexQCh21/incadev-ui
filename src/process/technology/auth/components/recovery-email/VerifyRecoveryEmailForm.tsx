import { useState } from "react"
import { useRecoveryEmail } from "../../hooks/useRecoveryEmail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle, RotateCw } from "lucide-react"

interface VerifyRecoveryEmailFormProps {
  email: string
  token: string
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Formulario para verificar el email de recuperación con el código enviado
 */
export function VerifyRecoveryEmailForm({
  email,
  token,
  onSuccess,
  onCancel
}: VerifyRecoveryEmailFormProps) {
  const [code, setCode] = useState("")
  const [resending, setResending] = useState(false)
  const {
    loading,
    error,
    success,
    verifyRecoveryEmail,
    resendVerificationCode,
    clearMessages
  } = useRecoveryEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    const result = await verifyRecoveryEmail({ code }, token)

    if (result?.success && onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }
  }

  const handleResendCode = async () => {
    setResending(true)
    clearMessages()

    await resendVerificationCode({ email }, token)

    setResending(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verificar Email de Recuperación</h2>
        <p className="text-sm text-gray-600 mt-2">
          Ingresa el código de 6 dígitos que enviamos a <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verification-code">Código de Verificación</Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="verification-code"
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              disabled={loading}
              className="pl-10 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
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
              Email de recuperación verificado exitosamente.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || resending}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !code || code.length !== 6}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Código"
            )}
          </Button>
        </div>

        <div className="text-center pt-2">
          <Button
            type="button"
            variant="link"
            onClick={handleResendCode}
            disabled={resending || loading}
            className="text-sm"
          >
            {resending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <RotateCw className="mr-2 h-3 w-3" />
                Reenviar código
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
