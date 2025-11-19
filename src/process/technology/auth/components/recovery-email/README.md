# Recovery Email Components

Componentes para gestionar la funcionalidad de email de recuperación en el sistema de autenticación.

## Descripción

Estos componentes permiten a los usuarios agregar, verificar y gestionar un email de recuperación alternativo que puede ser usado para recuperar su cuenta en caso de olvidar su contraseña.

## Componentes Disponibles

### 1. AddRecoveryEmailForm

Formulario para agregar un nuevo email de recuperación.

**Props:**
- `token` (string, requerido): Token de autenticación del usuario
- `onSuccess` (función, opcional): Callback que se ejecuta cuando el email se agrega exitosamente
- `onCancel` (función, opcional): Callback para cancelar la acción

**Ejemplo de uso:**
```tsx
import { AddRecoveryEmailForm } from "@/process/technology/auth/components/recovery-email"

function MyComponent() {
  const token = "user-auth-token"

  const handleSuccess = () => {
    console.log("Email de recuperación agregado")
  }

  return (
    <AddRecoveryEmailForm
      token={token}
      onSuccess={handleSuccess}
      onCancel={() => console.log("Cancelado")}
    />
  )
}
```

### 2. VerifyRecoveryEmailForm

Formulario para verificar el email de recuperación mediante un código de 6 dígitos.

**Props:**
- `email` (string, requerido): El email que se está verificando
- `token` (string, requerido): Token de autenticación del usuario
- `onSuccess` (función, opcional): Callback que se ejecuta cuando la verificación es exitosa
- `onCancel` (función, opcional): Callback para cancelar la acción

**Ejemplo de uso:**
```tsx
import { VerifyRecoveryEmailForm } from "@/process/technology/auth/components/recovery-email"

function MyComponent() {
  const token = "user-auth-token"
  const email = "recovery@example.com"

  return (
    <VerifyRecoveryEmailForm
      email={email}
      token={token}
      onSuccess={() => console.log("Verificado")}
    />
  )
}
```

### 3. RecoveryEmailManager

Componente para mostrar y gestionar el email de recuperación actual del usuario.

**Props:**
- `recoveryEmail` (string, opcional): El email de recuperación actual
- `isVerified` (boolean, opcional): Indica si el email está verificado (default: false)
- `token` (string, requerido): Token de autenticación del usuario
- `onRemove` (función, opcional): Callback que se ejecuta cuando se elimina el email
- `onAdd` (función, opcional): Callback para agregar un nuevo email

**Ejemplo de uso:**
```tsx
import { RecoveryEmailManager } from "@/process/technology/auth/components/recovery-email"

function MyComponent() {
  const token = "user-auth-token"
  const user = {
    recoveryEmail: "recovery@example.com",
    isVerified: true
  }

  return (
    <RecoveryEmailManager
      recoveryEmail={user.recoveryEmail}
      isVerified={user.isVerified}
      token={token}
      onRemove={() => console.log("Email eliminado")}
      onAdd={() => console.log("Agregar nuevo email")}
    />
  )
}
```

## Flujo de Uso Completo

### Paso 1: Agregar Email de Recuperación
```tsx
<AddRecoveryEmailForm
  token={authToken}
  onSuccess={() => setStep('verify')}
/>
```

### Paso 2: Verificar Email
```tsx
<VerifyRecoveryEmailForm
  email={recoveryEmail}
  token={authToken}
  onSuccess={() => setStep('complete')}
/>
```

### Paso 3: Gestionar Email (en configuración de perfil)
```tsx
<RecoveryEmailManager
  recoveryEmail={user.recoveryEmail}
  isVerified={user.emailVerified}
  token={authToken}
  onRemove={handleRemove}
/>
```

## Hook Relacionado

Estos componentes utilizan el hook `useRecoveryEmail` que proporciona las siguientes funciones:

- `addRecoveryEmail(data, token)`: Agrega un email de recuperación
- `verifyRecoveryEmail(data, token)`: Verifica el código enviado al email
- `resendVerificationCode(data, token)`: Reenvía el código de verificación
- `removeRecoveryEmail(token)`: Elimina el email de recuperación

## Configuración de API

Asegúrate de que los endpoints estén configurados en `src/config/technology-config.ts`:

```typescript
recoveryEmail: {
  add: "/auth/recovery-email/add",
  verify: "/auth/recovery-email/verify",
  resendCode: "/auth/recovery-email/resend-code",
  remove: "/auth/recovery-email/remove",
}
```

## Dependencias

Estos componentes requieren:
- shadcn/ui components (Button, Input, Label, Alert, Card, AlertDialog)
- lucide-react icons
- React hooks (useState)

## Notas de Seguridad

- Todos los endpoints requieren autenticación mediante token Bearer
- El código de verificación tiene 6 dígitos
- Solo se permite entrada numérica en el campo de código
- El código expira después de un tiempo determinado (configurado en el backend)
