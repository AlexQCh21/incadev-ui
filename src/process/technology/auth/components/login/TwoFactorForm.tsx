import type { UseFormRegister, UseFormSetValue } from "react-hook-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
  const handleBack = () => {
    setValue("code", "")
    onBack()
  }

  return (
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
        onClick={handleBack}
        className="text-sm"
      >
        ← Volver al inicio de sesión
      </Button>
    </>
  )
}
