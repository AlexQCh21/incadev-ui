import { useState } from "react"
import { toast } from "sonner"
import { routes } from "@/process/technology/technology-site"
import { config } from "@/config/technology-config"

interface LoginCredentials {
  email: string
  password: string
  role: string
}

interface LoginFormData extends LoginCredentials {
  code?: string
}

export function useLoginAuth() {
  const [requires2FA, setRequires2FA] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials | null>(null)

  const handle2FAVerification = async (data: LoginFormData) => {
    if (!loginCredentials) return

    if (!data.code || data.code.trim() === "") {
      toast.error("Código requerido", {
        description: "Por favor, ingresa el código de autenticación de dos factores.",
      })
      return
    }

    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.twoFactor.verifyLogin}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginCredentials.email,
          password: loginCredentials.password,
          code: data.code,
          role: loginCredentials.role,
        }),
      })

      if (response.ok) {
        const responseData = await response.json()

        if (responseData.success && responseData.data) {
          // Asegurar que el rol esté en el objeto user
          const userWithRole = {
            ...responseData.data.user,
            role: loginCredentials.role
          }

          localStorage.setItem("token", responseData.data.token)
          localStorage.setItem("user", JSON.stringify(userWithRole))

          toast.success("¡Autenticación exitosa!", {
            description: "Verificación 2FA completada. Redirigiendo...",
          })

          const dashboardRoute = routes.dashboard[loginCredentials.role as keyof typeof routes.dashboard] || routes.dashboard.index

          setTimeout(() => {
            window.location.href = dashboardRoute
          }, 1500)
          return true
        }
      } else {
        const errorData = await response.json()
        toast.error("Código incorrecto", {
          description: errorData.message || "El código 2FA ingresado no es válido.",
        })
        return false
      }
    } catch (error) {
      console.error("Error en verificación 2FA:", error)
      toast.error("Error de conexión", {
        description: "Hubo un error al verificar el código 2FA.",
      })
      return false
    }
  }

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await fetch(`${config.apiUrl}${config.endpoints.auth.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      })

      if (response.ok) {
        const responseData = await response.json()

        // Verificar si requiere 2FA
        if (responseData.requires_2fa) {
          setRequires2FA(true)
          setLoginCredentials({
            email: data.email,
            password: data.password,
            role: data.role,
          })

          toast.info("Verificación 2FA requerida", {
            description: "Por favor, ingresa tu código de autenticación de dos factores.",
          })
          return
        }

        // Login exitoso sin 2FA
        if (responseData.success && responseData.data) {
          // Asegurar que el rol esté en el objeto user
          const userWithRole = {
            ...responseData.data.user,
            role: data.role
          }

          localStorage.setItem("token", responseData.data.token)
          localStorage.setItem("user", JSON.stringify(userWithRole))

          toast.success("¡Inicio de sesión exitoso!", {
            description: "Redirigiendo a tu dashboard.",
          })

          const dashboardRoute = routes.dashboard[data.role as keyof typeof routes.dashboard] || routes.dashboard.index

          setTimeout(() => {
            window.location.href = dashboardRoute
          }, 1500)
          return
        }
      }

      // Manejar errores
      const errorData = await response.json()

      // Verificar si el error indica que se requiere 2FA
      if (errorData.requires_2fa) {
        setRequires2FA(true)
        setLoginCredentials({
          email: data.email,
          password: data.password,
          role: data.role,
        })

        toast.info("Verificación 2FA requerida", {
          description: "Por favor, ingresa tu código de autenticación de dos factores.",
        })
        return
      }

      // Mostrar el mensaje de error principal
      if (errorData.success === false && errorData.message) {
        toast.error("Error en el inicio de sesión", {
          description: errorData.message,
          duration: 5000,
        })
      } else {
        toast.error("Error en el inicio de sesión", {
          description: errorData.message || "Credenciales inválidas.",
          duration: 5000,
        })
      }

      // Mostrar errores de validación si existen
      if (errorData.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => {
              toast.error(`Error en ${field}`, {
                description: message,
                duration: 5000,
              })
            })
          }
        })
      }
    } catch (error) {
      console.error("Error en login:", error)
      toast.error("Error de conexión", {
        description: "Hubo un error al conectar con el servidor.",
      })
    }
  }

  const resetAuth = () => {
    setRequires2FA(false)
    setLoginCredentials(null)
  }

  return {
    requires2FA,
    loginCredentials,
    handleLogin,
    handle2FAVerification,
    resetAuth
  }
}
