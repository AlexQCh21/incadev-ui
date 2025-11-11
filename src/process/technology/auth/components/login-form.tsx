"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IconShieldCheck } from "@tabler/icons-react"

// Components
import { AuthHeader } from "./login/AuthHeader"
import { RoleSelector, TECH_ROLES } from "./login/RoleSelector"
import { LoginCard } from "./login/LoginCard"
import { LoginFormFields } from "./login/LoginFormFields"
import { TwoFactorForm } from "./login/TwoFactorForm"

// Hooks
import { useLoginAuth } from "../hooks/useLoginAuth"

// Form Schema
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
})

type LoginFormData = z.infer<typeof FormSchema>

// Icon mapping
const iconMap: Record<string, any> = {
  IconShieldCheck,
  IconLifebuoy: IconShieldCheck,
  IconServer: IconShieldCheck,
  IconShield: IconShieldCheck,
  IconChartBar: IconShieldCheck,
  IconCode: IconShieldCheck,
}

export function LoginForm() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const {
    requires2FA,
    loginCredentials,
    handleLogin,
    handle2FAVerification,
    resetAuth
  } = useLoginAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: selectedRole || "admin",
      code: "",
    },
  })

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setValue("role", roleId)
    setShowLoginForm(true)
  }

  const handleBackToRoles = () => {
    setShowLoginForm(false)
    setSelectedRole(null)
    resetAuth()
  }

  const handleBackTo2FA = () => {
    resetAuth()
  }

  const onSubmit = async (data: LoginFormData) => {
    if (requires2FA && loginCredentials) {
      await handle2FAVerification(data)
    } else {
      await handleLogin(data)
    }
  }

  // Si no se ha seleccionado un rol, mostrar la selección de roles
  if (!showLoginForm) {
    return (
      <>
        <AuthHeader />
        <RoleSelector onRoleSelect={handleRoleSelect} />
      </>
    )
  }

  // Si se ha seleccionado un rol, mostrar el formulario de login
  const selectedRoleData = TECH_ROLES.find(r => r.id === selectedRole)
  const RoleIcon = selectedRoleData ? iconMap[selectedRoleData.icon] || IconShieldCheck : IconShieldCheck

  return (
    <>
      <AuthHeader />
      <LoginCard
        selectedRole={selectedRoleData}
        roleIcon={RoleIcon}
        requires2FA={requires2FA}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      >
        {!requires2FA ? (
          <LoginFormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            onBackToRoles={handleBackToRoles}
          />
        ) : (
          <TwoFactorForm
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            setValue={setValue}
            onBack={handleBackTo2FA}
          />
        )}
      </LoginCard>
    </>
  )
}
