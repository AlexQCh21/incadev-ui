import { useState } from "react"
import type { UseFormRegister, FieldErrors as RHFFieldErrors } from "react-hook-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IconMail, IconLock, IconEye, IconEyeOff, IconArrowLeft } from "@tabler/icons-react"

interface LoginFormData {
  email: string
  password: string
  role: string
  code?: string
}

type FieldErrors<T> = Partial<Record<keyof T, { message?: string }>>

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginFormData>
  errors: FieldErrors<LoginFormData>
  isSubmitting: boolean
  onBackToRoles: () => void
}

export function LoginFormFields({
  register,
  errors,
  isSubmitting,
  onBackToRoles
}: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
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
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <a
            href="/tecnologico/forgot-password"
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
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
        onClick={onBackToRoles}
        className="text-sm -mt-2"
      >
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Cambiar rol
      </Button>
    </>
  )
}
