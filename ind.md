# Recuperación de Contraseña - API Documentation

## Flujo General

1. Usuario ingresa su **email de recuperación** (recovery_email)
2. Backend envía un email con un enlace que contiene un token
3. Usuario hace clic en el enlace y es redirigido al frontend
4. Usuario ingresa su nueva contraseña
5. Backend valida el token y actualiza la contraseña

---

## Endpoints

### 1. Solicitar enlace de recuperación

```http
POST /api/auth/forgot-password
```

**Request:**
```json
{
  "email": "recovery_email@ejemplo.com"
}
```

**Response 200 (Éxito):**
```json
{
  "success": true,
  "message": "Se ha enviado un enlace de recuperación a tu correo de recuperación."
}
```

**Response 404 (Email no encontrado o no verificado):**
```json
{
  "success": false,
  "message": "No existe una cuenta con este correo de recuperación o no ha sido verificado."
}
```

**Notas importantes:**
- El `email` debe ser el **recovery_email** del usuario (no el email principal)
- El recovery_email debe estar **verificado** (`recovery_email_verified_at` != null)
- El email contiene un enlace con formato: `{FRONTEND_URL}/tecnologico/reset-password?token={TOKEN}&email={EMAIL_PRINCIPAL}`

---

### 2. Restablecer contraseña

```http
POST /api/auth/reset-password
```

**Request:**
```json
{
  "email": "email_principal@ejemplo.com",
  "token": "ABC123XYZ789...",
  "password": "NuevaPassword123",
  "password_confirmation": "NuevaPassword123"
}
```

**Response 200 (Éxito):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente. Puedes iniciar sesión con tu nueva contraseña."
}
```

**Response 400 (Token inválido o expirado):**
```json
{
  "success": false,
  "message": "Token inválido o expirado. Solicita un nuevo enlace de recuperación."
}
```

**Response 422 (Validación fallida):**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Notas importantes:**
- El `email` debe ser el **email principal** del usuario (viene en el parámetro de la URL del enlace)
- El `token` viene en el parámetro de la URL del enlace
- La contraseña debe tener mínimo 8 caracteres
- `password` y `password_confirmation` deben coincidir
- Al cambiar la contraseña, **todos los tokens de sesión activos se revocan automáticamente**
- El token expira en **60 minutos**

---

## Implementación en Frontend

### Paso 1: Página "Olvidé mi contraseña"

```javascript
// Formulario con un input para recovery_email
const handleForgotPassword = async (recoveryEmail) => {
  const response = await fetch('http://127.0.0.1:8000/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: recoveryEmail
    })
  });

  const data = await response.json();

  if (data.success) {
    // Mostrar mensaje: "Revisa tu correo de recuperación"
  } else {
    // Mostrar error
  }
};
```

### Paso 2: Página "Restablecer contraseña"

La URL será: `/tecnologico/reset-password?token=ABC123&email=user@ejemplo.com`

```javascript
// Extraer parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const email = urlParams.get('email');

// Formulario con inputs para password y password_confirmation
const handleResetPassword = async (password, passwordConfirmation) => {
  const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      token: token,
      password: password,
      password_confirmation: passwordConfirmation
    })
  });

  const data = await response.json();

  if (data.success) {
    // Redirigir a login con mensaje de éxito
  } else {
    // Mostrar error (token expirado, contraseñas no coinciden, etc.)
  }
};
```

---

## Diferencia importante: Email Principal vs Recovery Email

| Campo | Uso |
|-------|-----|
| **email** (principal) | Email principal del usuario, usado para login y en el token de reset |
| **recovery_email** | Email de recuperación, usado SOLO para solicitar el enlace de reset |

**Flujo:**
1. Usuario ingresa `recovery_email` → Backend envía email a `recovery_email`
2. Email contiene enlace con `email` principal en la URL
3. Usuario usa `email` principal + `token` para resetear contraseña

---

## Validaciones

### forgot-password
- `email`: required, email válido

### reset-password
- `email`: required, email válido, debe existir en BD
- `token`: required, string
- `password`: required, mínimo 8 caracteres
- `password_confirmation`: required, debe coincidir con password

---

## Posibles Errores

| Código | Escenario | Mensaje |
|--------|-----------|---------|
| 404 | Recovery email no existe o no verificado | "No existe una cuenta con este correo de recuperación o no ha sido verificado." |
| 400 | Token inválido o expirado | "Token inválido o expirado. Solicita un nuevo enlace de recuperación." |
| 422 | Validación fallida | Errores específicos por campo |
| 500 | Error del servidor | "Error al enviar el enlace de recuperación" |
