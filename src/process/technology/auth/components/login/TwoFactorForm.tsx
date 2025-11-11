import { useState, useRef, useEffect } from "react"
import type { UseFormRegister, UseFormSetValue } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { IconShieldCheck } from "@tabler/icons-react"

interface LoginFormData {
  email: string
  password: string
  role: string
  code?: string
}

type FieldErrors<T> = Partial<Record<keyof T, { message?: string }>>

interface TwoFactorFormProps {
  register: UseFormRegister<LoginFormData>
  errors: FieldErrors<LoginFormData>
  isSubmitting: boolean
  setValue: UseFormSetValue<LoginFormData>
  onBack: () => void
}

export function TwoFactorForm({
  register,
  errors,
  isSubmitting,
  setValue,
  onBack
}: TwoFactorFormProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleBack = () => {
    setValue("code", "")
    setCode(["", "", "", "", "", ""])
    onBack()
  }

  const handleChange = (index: number, value: string) => {
    // Solo permitir dígitos
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Actualizar el valor del formulario
    setValue("code", newCode.join(""))

    // Mover al siguiente input si hay un valor
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Solo permitir si son 6 dígitos
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("")
      setCode(newCode)
      setValue("code", pastedData)
      // Enfocar el último input
      inputRefs.current[5]?.focus()
    }
  }

  useEffect(() => {
    // Auto-focus en el primer input
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <>
      <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800/50">
        <IconShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <p className="text-sm text-foreground">
          Autenticación de dos factores activada
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Ingresa el código de verificación</h3>
          <p className="text-sm text-muted-foreground">
            Ingresa el código de 6 dígitos de tu aplicación de autenticación
          </p>
        </div>

        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isSubmitting}
              className="w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label={`Dígito ${index + 1}`}
            />
          ))}
        </div>

        {errors.code && (
          <p className="text-sm text-red-500 text-center">{errors.code.message}</p>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Serás redirigido automáticamente después de ingresar el código
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-sm"
      >
        ← Volver al inicio de sesión
      </Button>
    </>
  )
}
