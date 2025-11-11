import { useState, useEffect } from "react"
import TechnologyLayout from "@/process/technology/TechnologyLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  IconDeviceFloppy,
  IconUser,
  IconEdit,
  IconX,
  IconShieldCheck,
  IconShieldOff,
  IconMail,
  IconMailCheck,
  IconTrash,
  IconRefresh,
  IconQrcode
} from "@tabler/icons-react"
import { toast } from "sonner"
import { config } from "@/config/technology-config"

interface User {
  id: number
  name: string
  fullname?: string
  email: string
  dni?: string
  phone?: string
  roles?: string[]
  two_factor_enabled?: boolean
  recovery_email?: string
  recovery_email_verified?: boolean
}
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const ProfileFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  fullname: z.string().optional(),
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  dni: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false
  }
  return true
}, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"],
})

type ProfileFormData = z.infer<typeof ProfileFormSchema>

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // 2FA States
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [twoFACode, setTwoFACode] = useState("")
  const [twoFAPassword, setTwoFAPassword] = useState("")
  const [processing2FA, setProcessing2FA] = useState(false)

  // Recovery Email States
  const [showRecoveryEmailSetup, setShowRecoveryEmailSetup] = useState(false)
  const [recoveryEmailStep, setRecoveryEmailStep] = useState<'add' | 'verify'>('add')
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [processingRecovery, setProcessingRecovery] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      fullname: "",
      email: "",
      dni: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.me}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        // Según ind.txt: { success: true, data: { user: {...} } }
        if (responseData.success && responseData.data && responseData.data.user) {
          const userData = responseData.data.user
          setUser(userData)
          reset({
            name: userData.name,
            fullname: userData.fullname || "",
            email: userData.email,
            dni: userData.dni || "",
            phone: userData.phone || "",
            password: "",
            password_confirmation: "",
          })
        }
      } else {
        toast.error("Error al cargar perfil")
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Error al cargar perfil")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true)
      const token = localStorage.getItem("token")

      const updateData: any = {
        name: data.name,
        email: data.email,
      }
      if (data.fullname) updateData.fullname = data.fullname
      if (data.dni) updateData.dni = data.dni
      if (data.phone) updateData.phone = data.phone
      if (data.password) {
        updateData.password = data.password
        updateData.password_confirmation = data.password_confirmation
      }

      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.profile}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const responseData = await response.json()
        // Según ind.txt: { success: true, message: "...", data: { user: {...} } }
        if (responseData.success && responseData.data && responseData.data.user) {
          const userData = responseData.data.user
          setUser(userData)

          // Actualizar localStorage con el usuario actualizado
          localStorage.setItem("user", JSON.stringify(userData))

          toast.success("Perfil actualizado exitosamente")
          setEditMode(false)
          reset({
            ...data,
            password: "",
            password_confirmation: "",
          })
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error al actualizar perfil")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  // ============== 2FA Functions ==============

  const handleEnable2FA = async () => {
    try {
      setProcessing2FA(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.twoFactor.enable}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setQrCodeUrl(data.qr_code_url)
        setSecret(data.secret)
        setRecoveryCodes(data.recovery_codes || [])
        setShow2FASetup(true)
        toast.info("Escanea el código QR con Google Authenticator")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error al habilitar 2FA")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al habilitar 2FA")
    } finally {
      setProcessing2FA(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!twoFACode) {
      toast.error("Ingresa el código de 6 dígitos")
      return
    }

    try {
      setProcessing2FA(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.twoFactor.verify}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: twoFACode }),
      })

      if (response.ok) {
        toast.success("2FA habilitado exitosamente")
        setShow2FASetup(false)
        setTwoFACode("")
        loadProfile()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Código inválido")
      }
    } catch (error: any) {
      toast.error(error.message || "Código inválido")
    } finally {
      setProcessing2FA(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!twoFAPassword) {
      toast.error("Ingresa tu contraseña")
      return
    }

    if (!confirm("¿Estás seguro de deshabilitar 2FA? Tu cuenta será menos segura.")) {
      return
    }

    try {
      setProcessing2FA(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.twoFactor.disable}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: twoFAPassword }),
      })

      if (response.ok) {
        toast.success("2FA deshabilitado")
        setTwoFAPassword("")
        loadProfile()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Contraseña incorrecta")
      }
    } catch (error: any) {
      toast.error(error.message || "Contraseña incorrecta")
    } finally {
      setProcessing2FA(false)
    }
  }

  const handleRegenerateRecoveryCodes = async () => {
    const password = prompt("Ingresa tu contraseña para regenerar códigos:")
    if (!password) return

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.twoFactor.regenerateRecoveryCodes}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecoveryCodes(data.recovery_codes || [])
        toast.success("Códigos regenerados. Guárdalos en un lugar seguro.")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error al regenerar códigos")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al regenerar códigos")
    }
  }

  // ============== Recovery Email Functions ==============

  const handleAddRecoveryEmail = async () => {
    if (!recoveryEmail) {
      toast.error("Ingresa un email de recuperación")
      return
    }

    try {
      setProcessingRecovery(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.recoveryEmail.add}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recovery_email: recoveryEmail }),
      })

      if (response.ok) {
        toast.success("Código enviado a tu email de recuperación")
        setRecoveryEmailStep('verify')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error al agregar email")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al agregar email")
    } finally {
      setProcessingRecovery(false)
    }
  }

  const handleVerifyRecoveryEmail = async () => {
    if (!recoveryCode) {
      toast.error("Ingresa el código de 6 dígitos")
      return
    }

    try {
      setProcessingRecovery(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.recoveryEmail.verify}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: recoveryCode }),
      })

      if (response.ok) {
        toast.success("Email de recuperación verificado")
        setShowRecoveryEmailSetup(false)
        setRecoveryEmail("")
        setRecoveryCode("")
        setRecoveryEmailStep('add')
        loadProfile()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Código inválido")
      }
    } catch (error: any) {
      toast.error(error.message || "Código inválido")
    } finally {
      setProcessingRecovery(false)
    }
  }

  const handleResendRecoveryCode = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.recoveryEmail.resendCode}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast.success("Nuevo código enviado")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error al reenviar código")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al reenviar código")
    }
  }

  const handleRemoveRecoveryEmail = async () => {
    if (!confirm("¿Estás seguro de eliminar el email de recuperación?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${config.apiUrl}${config.endpoints.recoveryEmail.remove}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast.success("Email de recuperación eliminado")
        loadProfile()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Error al eliminar email")
      }
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar email")
    }
  }

  if (loading) {
    return (
      <TechnologyLayout title="Mi Perfil">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </TechnologyLayout>
    )
  }

  return (
    <TechnologyLayout title="Mi Perfil">
      <div className="flex flex-1 flex-col items-center">
        <div className="@container/main flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-[1400px] w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
              <p className="text-muted-foreground">
                Administra tu información personal y configuración de seguridad
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Profile Info */}
            <div className="space-y-8">
              {/* Profile Card */}
              <Card className="shadow-sm border-muted">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-xl">Información Personal</CardTitle>
                    <CardDescription className="text-sm mt-1.5">
                      Tu información de perfil y datos de contacto
                    </CardDescription>
                  </div>
                  {!editMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      <IconEdit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-8">
                  {!editMode ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconUser className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold">{user?.fullname || user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                          <p className="text-sm">{user?.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                          <p className="text-sm">{user?.fullname || "No especificado"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">DNI</p>
                          <p className="text-sm">{user?.dni || "No especificado"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                          <p className="text-sm">{user?.phone || "No especificado"}</p>
                        </div>
                      </div>

                      {user?.roles && user.roles.length > 0 && (
                        <div className="space-y-2 pt-4 border-t">
                          <p className="text-sm font-medium">Roles Asignados</p>
                          <div className="flex flex-wrap gap-2">
                            {user.roles.map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <FieldGroup>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field>
                            <FieldLabel htmlFor="name">Nombre *</FieldLabel>
                            <Input id="name" {...register("name")} disabled={isSubmitting || saving} />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="fullname">Nombre Completo</FieldLabel>
                            <Input id="fullname" {...register("fullname")} disabled={isSubmitting || saving} />
                          </Field>
                        </div>

                        <Field>
                          <FieldLabel htmlFor="email">Email *</FieldLabel>
                          <Input id="email" type="email" {...register("email")} disabled={isSubmitting || saving} />
                          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </Field>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Field>
                            <FieldLabel htmlFor="dni">DNI</FieldLabel>
                            <Input id="dni" {...register("dni")} disabled={isSubmitting || saving} />
                          </Field>

                          <Field>
                            <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                            <Input id="phone" {...register("phone")} disabled={isSubmitting || saving} />
                          </Field>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                          <h3 className="text-sm font-medium">Cambiar Contraseña (Opcional)</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                              <FieldLabel htmlFor="password">Nueva Contraseña</FieldLabel>
                              <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                disabled={isSubmitting || saving}
                                placeholder="Mínimo 8 caracteres"
                              />
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="password_confirmation">Confirmar Contraseña</FieldLabel>
                              <Input
                                id="password_confirmation"
                                type="password"
                                {...register("password_confirmation")}
                                disabled={isSubmitting || saving}
                              />
                              {errors.password_confirmation && (
                                <p className="text-sm text-red-500 mt-1">{errors.password_confirmation.message}</p>
                              )}
                            </Field>
                          </div>
                        </div>
                      </FieldGroup>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={isSubmitting || saving}>
                          <IconDeviceFloppy className="mr-2 h-4 w-4" />
                          {isSubmitting || saving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditMode(false)
                            reset()
                          }}
                        >
                          <IconX className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Security */}
            <div className="space-y-8">
              {/* 2FA Card */}
              <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <IconShieldCheck className="h-5 w-5" />
                    Autenticación 2FA
                  </CardTitle>
                  <CardDescription className="text-sm mt-1.5">
                    Protege tu cuenta con verificación de dos pasos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  {user?.two_factor_enabled ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <IconShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">
                          2FA Habilitado
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateRecoveryCodes}
                        className="w-full"
                      >
                        <IconRefresh className="mr-2 h-4 w-4" />
                        Regenerar Códigos de Recuperación
                      </Button>

                      <div className="space-y-2">
                        <FieldLabel>Contraseña para deshabilitar</FieldLabel>
                        <Input
                          type="password"
                          placeholder="Tu contraseña"
                          value={twoFAPassword}
                          onChange={(e) => setTwoFAPassword(e.target.value)}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDisable2FA}
                          disabled={processing2FA}
                          className="w-full"
                        >
                          <IconShieldOff className="mr-2 h-4 w-4" />
                          {processing2FA ? "Deshabilitando..." : "Deshabilitar 2FA"}
                        </Button>
                      </div>

                      {recoveryCodes.length > 0 && (
                        <div className="space-y-3 p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border-2 border-yellow-200 dark:border-yellow-800/50">
                          <div className="flex items-start gap-2">
                            <IconShieldCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                                Códigos de Recuperación
                              </p>
                              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                Guárdalos en un lugar seguro
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {recoveryCodes.map((code, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-yellow-300 dark:border-yellow-700"
                              >
                                <code className="text-xs font-mono font-semibold flex-1">
                                  {code}
                                </code>
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const text = recoveryCodes.join('\n')
                              navigator.clipboard.writeText(text)
                              toast.success("Códigos copiados")
                            }}
                            className="w-full"
                          >
                            Copiar códigos
                          </Button>
                        </div>
                      )}
                    </>
                  ) : !show2FASetup ? (
                    <Button
                      onClick={handleEnable2FA}
                      disabled={processing2FA}
                      className="w-full"
                    >
                      <IconShieldCheck className="mr-2 h-4 w-4" />
                      {processing2FA ? "Habilitando..." : "Habilitar 2FA"}
                    </Button>
                  ) : (
                    <div className="space-y-6">
                      {/* Step 1: QR Code */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            1
                          </div>
                          <p className="text-sm font-medium">Escanea el código QR</p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-border">
                          {qrCodeUrl && (
                            <div className="flex flex-col items-center gap-4">
                              {/* QR Code usando API diferente para mejor compatibilidad */}
                              <div className="p-4 bg-white rounded-lg">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeUrl)}`}
                                  alt="QR Code para Google Authenticator"
                                  className="rounded"
                                  width="250"
                                  height="250"
                                  onError={(e) => {
                                    // Fallback a Google Charts API si falla
                                    e.currentTarget.src = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(qrCodeUrl)}&choe=UTF-8`
                                  }}
                                />
                              </div>
                              <div className="text-center space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Usa Google Authenticator, Authy o similar
                                </p>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Código manual:</p>
                                  <div className="flex items-center justify-center gap-2 p-2 bg-muted rounded">
                                    <code className="text-xs font-mono font-semibold text-foreground">{secret}</code>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(secret)
                                        toast.success("Código copiado")
                                      }}
                                      className="text-xs text-primary hover:underline"
                                    >
                                      Copiar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 2: Recovery Codes */}
                      {recoveryCodes.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                              2
                            </div>
                            <p className="text-sm font-medium">Guarda tus códigos de recuperación</p>
                          </div>

                          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border-2 border-amber-200 dark:border-amber-800/50 space-y-3">
                            <div className="flex items-start gap-2">
                              <IconShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                  ⚠️ Importante: Guarda estos códigos
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Usa estos códigos si pierdes acceso a tu autenticador. Solo se muestran una vez.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {recoveryCodes.map((code, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 bg-card rounded border border-border"
                                >
                                  <code className="text-xs font-mono font-semibold flex-1 text-foreground">
                                    {code}
                                  </code>
                                </div>
                              ))}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const text = recoveryCodes.join('\n')
                                navigator.clipboard.writeText(text)
                                toast.success("Códigos copiados al portapapeles")
                              }}
                              className="w-full"
                            >
                              Copiar todos los códigos
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Verify */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            3
                          </div>
                          <p className="text-sm font-medium">Verifica el código</p>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <FieldLabel>Ingresa el código de 6 dígitos</FieldLabel>
                            <Input
                              type="text"
                              placeholder="123456"
                              maxLength={6}
                              value={twoFACode}
                              onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                              className="text-center text-2xl tracking-widest font-mono"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                              Código de tu app de autenticación
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleVerify2FA}
                              disabled={processing2FA || twoFACode.length !== 6}
                              className="flex-1"
                            >
                              <IconShieldCheck className="mr-2 h-4 w-4" />
                              {processing2FA ? "Verificando..." : "Activar 2FA"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShow2FASetup(false)
                                setTwoFACode("")
                              }}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recovery Email Card */}
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
                  {user?.recovery_email && user?.recovery_email_verified ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <IconMailCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {user.recovery_email}
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">Verificado</p>
                        </div>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveRecoveryEmail}
                        className="w-full"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Eliminar Email de Recuperación
                      </Button>
                    </>
                  ) : !showRecoveryEmailSetup ? (
                    <Button
                      onClick={() => setShowRecoveryEmailSetup(true)}
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
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Debe ser diferente a tu email principal
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddRecoveryEmail}
                          disabled={processingRecovery || !recoveryEmail}
                          className="flex-1"
                        >
                          <IconMail className="mr-2 h-4 w-4" />
                          {processingRecovery ? "Enviando..." : "Enviar Código"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRecoveryEmailSetup(false)
                            setRecoveryEmail("")
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
                          Código enviado a <strong>{recoveryEmail}</strong>
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
                            onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))}
                            className="text-center text-2xl tracking-widest font-mono"
                          />
                          <p className="text-xs text-muted-foreground text-center">
                            Revisa tu bandeja de entrada
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleVerifyRecoveryEmail}
                            disabled={processingRecovery || recoveryCode.length !== 6}
                            className="flex-1"
                          >
                            <IconMailCheck className="mr-2 h-4 w-4" />
                            {processingRecovery ? "Verificando..." : "Verificar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleResendRecoveryCode}
                            title="Reenviar código"
                          >
                            <IconRefresh className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRecoveryEmailStep('add')
                            setRecoveryCode("")
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
            </div>
          </div>
        </div>
      </div>
    </TechnologyLayout>
  )
}
