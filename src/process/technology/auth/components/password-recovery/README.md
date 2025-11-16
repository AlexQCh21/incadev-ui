# Password Recovery Components

Componentes para la funcionalidad de recuperación de contraseña del módulo tecnológico.

## Componentes

### ForgotPasswordForm
Formulario para solicitar recuperación de contraseña mediante email.

**Ubicación:** `/tecnologico/forgot-password`

**Características:**
- Validación de email con Zod
- Integración con hook `usePasswordRecovery`
- Mensajes de éxito/error con componentes Alert
- Diseño responsivo con Tailwind CSS
- Componentes shadcn/ui

### ResetPasswordForm
Formulario para restablecer la contraseña con token de recuperación.

**Ubicación:** `/tecnologico/reset-password?token=XXX&email=YYY`

**Características:**
- Validación robusta de contraseña (longitud, mayúsculas, minúsculas, números)
- Indicador de fortaleza de contraseña en tiempo real
- Campos de contraseña con toggle show/hide
- Validación de coincidencia de contraseñas
- Redirección automática al login después de éxito
- Manejo de tokens inválidos/expirados

### PasswordStrengthIndicator
Indicador visual de la fortaleza de la contraseña.

**Características:**
- Barra de progreso animada
- Cálculo de score basado en:
  - Longitud (8+ caracteres)
  - Letras minúsculas
  - Letras mayúsculas
  - Números
  - Caracteres especiales
- Etiquetas de estado: Débil, Media, Buena, Fuerte
- Lista de requisitos con checkmarks

## Hook

### usePasswordRecovery
Hook personalizado para manejar la lógica de API de recuperación de contraseña.

**Métodos:**
- `sendRecoveryEmail(data)` - Envía email de recuperación
- `resetPassword(data)` - Restablece la contraseña con token
- `clearMessages()` - Limpia mensajes de error/éxito

**Estados:**
- `loading` - Indica si hay una petición en curso
- `error` - Mensaje de error (si existe)
- `success` - Indica si la operación fue exitosa

## Configuración

### Technology Config
Archivo: `src/config/technology-config.ts`

```typescript
export const config = {
  apiUrl: "http://localhost:8000/api",
  environment: "development",
  endpoints: {
    auth: {
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
      // ... otros endpoints
    },
  },
}
```

## Flujo de Usuario

1. **Solicitar Recuperación**
   - Usuario accede a `/tecnologico/forgot-password`
   - Ingresa su email de recuperación
   - Sistema envía email con enlace

2. **Restablecer Contraseña**
   - Usuario hace clic en el enlace del email
   - Accede a `/tecnologico/reset-password?token=XXX&email=YYY`
   - Ingresa nueva contraseña
   - Sistema valida y actualiza contraseña
   - Redirección automática a login

## Validaciones

### Email (Forgot Password)
- Campo requerido
- Formato de email válido

### Password (Reset Password)
- Mínimo 8 caracteres
- Al menos una letra minúscula
- Al menos una letra mayúscula
- Al menos un número
- Confirmación debe coincidir

## Integración con Login

El componente `LoginFormFields` incluye un enlace "¿Olvidaste tu contraseña?" que redirige a `/tecnologico/forgot-password`.

## Tecnologías Utilizadas

- **React** (con TypeScript)
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Estilos
- **Tabler Icons** - Iconografía
- **Astro** - Framework de páginas

## Ejemplo de Uso

### Forgot Password Page (Astro)
```astro
---
import { ForgotPasswordForm } from '@/process/technology/auth/components/password-recovery/ForgotPasswordForm';
---

<ForgotPasswordForm client:load />
```

### Reset Password Page (Astro)
```astro
---
import { ResetPasswordForm } from '@/process/technology/auth/components/password-recovery/ResetPasswordForm';

const token = Astro.url.searchParams.get('token');
const email = Astro.url.searchParams.get('email');
---

<ResetPasswordForm client:load token={token} email={email} />
```

## Notas Importantes

- El sistema usa **recovery_email** (no email principal) para enviar el enlace
- Los tokens tienen una expiración configurable (default: 60 minutos)
- Todos los componentes son responsivos y accesibles
- Se incluyen estados de loading y mensajes de error descriptivos
- Los formularios están protegidos contra envíos múltiples
