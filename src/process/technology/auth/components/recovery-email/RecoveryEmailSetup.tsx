import { useState } from "react"
import { AddRecoveryEmailForm } from "./AddRecoveryEmailForm"
import { VerifyRecoveryEmailForm } from "./VerifyRecoveryEmailForm"
import { RecoveryEmailManager } from "./RecoveryEmailManager"

interface RecoveryEmailSetupProps {
  token: string
  currentRecoveryEmail?: string
  isVerified?: boolean
  onComplete?: () => void
}

type Step = "manage" | "add" | "verify"

/**
 * Componente completo para gestionar el setup de recovery email
 * Maneja los diferentes pasos: agregar, verificar y gestionar
 */
export function RecoveryEmailSetup({
  token,
  currentRecoveryEmail,
  isVerified = false,
  onComplete,
}: RecoveryEmailSetupProps) {
  const [step, setStep] = useState<Step>("manage")
  const [pendingEmail, setPendingEmail] = useState<string>("")
  const [recoveryEmail, setRecoveryEmail] = useState<string | undefined>(currentRecoveryEmail)
  const [verified, setVerified] = useState<boolean>(isVerified)

  const handleAddSuccess = () => {
    // El email fue agregado, ahora necesita verificación
    setStep("verify")
  }

  const handleVerifySuccess = () => {
    // Email verificado exitosamente
    setVerified(true)
    setRecoveryEmail(pendingEmail)
    setStep("manage")
    if (onComplete) {
      onComplete()
    }
  }

  const handleRemove = () => {
    // Email eliminado
    setRecoveryEmail(undefined)
    setVerified(false)
    setPendingEmail("")
    setStep("manage")
  }

  const handleAdd = () => {
    setStep("add")
  }

  const handleCancel = () => {
    setStep("manage")
    setPendingEmail("")
  }

  if (step === "add") {
    return (
      <AddRecoveryEmailForm
        token={token}
        onSuccess={handleAddSuccess}
        onCancel={handleCancel}
      />
    )
  }

  if (step === "verify" && pendingEmail) {
    return (
      <VerifyRecoveryEmailForm
        email={pendingEmail}
        token={token}
        onSuccess={handleVerifySuccess}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <RecoveryEmailManager
      recoveryEmail={recoveryEmail}
      isVerified={verified}
      token={token}
      onRemove={handleRemove}
      onAdd={handleAdd}
    />
  )
}
