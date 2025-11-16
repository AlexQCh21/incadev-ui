import { useState } from "react"
import { config } from "@/config/technology-config"

interface ForgotPasswordData {
  email: string
}

interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
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

export function usePasswordRecovery() {
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

  const sendRecoveryEmail = async (data: ForgotPasswordData) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.auth.forgotPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
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

  const resetPassword = async (data: ResetPasswordData) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.auth.resetPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
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

  const clearMessages = () => {
    setError("")
    setSuccess(false)
  }

  return {
    loading,
    error,
    success,
    sendRecoveryEmail,
    resetPassword,
    clearMessages,
  }
}
