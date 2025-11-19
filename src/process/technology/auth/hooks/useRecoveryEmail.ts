import { useState } from "react"
import { config } from "@/config/technology-config"

interface AddRecoveryEmailData {
  email: string
}

interface VerifyRecoveryEmailData {
  code: string
}

interface ResendCodeData {
  email: string
}

interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

interface ApiSuccess<T = any> {
  success: true
  message: string
  data?: T
}

type ApiResponse<T = any> = ApiSuccess<T> | ApiError

/**
 * Hook para gestionar la funcionalidad de recovery email
 * Permite agregar, verificar, reenviar código y eliminar email de recuperación
 */
export function useRecoveryEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)

  const handleApiError = (err: any): string => {
    if (err.response?.data?.message) {
      return err.response.data.message
    }

    if (err.response?.data?.errors) {
      const errors = Object.values(err.response.data.errors).flat()
      return (errors as string[]).join(", ")
    }

    return "Error al procesar la solicitud. Por favor, intenta de nuevo."
  }

  /**
   * Agregar un email de recuperación
   */
  const addRecoveryEmail = async (data: AddRecoveryEmailData, token: string) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.recoveryEmail.add}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      )

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw { response: { data: result } }
      }

      if (result.success) {
        setSuccess(true)
        return { success: true, message: result.message, data: result.data }
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Verificar el código de recuperación enviado al email
   */
  const verifyRecoveryEmail = async (data: VerifyRecoveryEmailData, token: string) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.recoveryEmail.verify}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      )

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw { response: { data: result } }
      }

      if (result.success) {
        setSuccess(true)
        return { success: true, message: result.message, data: result.data }
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reenviar código de verificación
   */
  const resendVerificationCode = async (data: ResendCodeData, token: string) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.recoveryEmail.resendCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      )

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw { response: { data: result } }
      }

      if (result.success) {
        setSuccess(true)
        return { success: true, message: result.message }
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Eliminar email de recuperación
   */
  const removeRecoveryEmail = async (token: string) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.recoveryEmail.remove}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      )

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw { response: { data: result } }
      }

      if (result.success) {
        setSuccess(true)
        return { success: true, message: result.message }
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError("")
    setSuccess(false)
  }

  return {
    loading,
    error,
    success,
    addRecoveryEmail,
    verifyRecoveryEmail,
    resendVerificationCode,
    removeRecoveryEmail,
    clearMessages,
  }
}
