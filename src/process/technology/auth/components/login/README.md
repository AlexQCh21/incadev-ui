# Login Components - Modular Structure

Esta carpeta contiene todos los componentes modulares del sistema de login para el módulo tecnológico.

## 📁 Estructura

```
login/
├── AuthHeader.tsx          # Header con logo y toggle de tema
├── RoleSelector.tsx        # Grid de selección de roles
├── LoginCard.tsx           # Card contenedor del formulario
├── LoginFormFields.tsx     # Campos de email y password
├── TwoFactorForm.tsx       # Formulario de 2FA
├── index.ts               # Exports centralizados
└── README.md              # Este archivo
```

## 🧩 Componentes

### AuthHeader
**Responsabilidad:** Header fijo con logo de INCADEV y toggle de tema dark/light

**Props:** Ninguna

**Ubicación:** Se muestra en todas las vistas del login

### RoleSelector
**Responsabilidad:** Grid de 6 cards para selección de rol

**Props:**
- `onRoleSelect: (roleId: string) => void` - Callback cuando se selecciona un rol

**Exports:**
- `TECH_ROLES` - Array con los 6 roles disponibles
- `TechRole` - Type del objeto de rol

### LoginCard
**Responsabilidad:** Card contenedor del formulario con header y botón de submit

**Props:**
- `selectedRole: TechRole | undefined` - Rol seleccionado
- `roleIcon: React.ComponentType` - Icono del rol
- `requires2FA: boolean` - Si está en modo 2FA
- `isSubmitting: boolean` - Estado de loading
- `children: React.ReactNode` - Campos del formulario
- `onSubmit: (e: React.FormEvent) => void` - Handler del submit

### LoginFormFields
**Responsabilidad:** Campos de email, password y botón de "volver a roles"

**Props:**
- `register: UseFormRegister<LoginFormData>` - React Hook Form register
- `errors: FieldErrors<LoginFormData>` - Errores de validación
- `isSubmitting: boolean` - Estado de loading
- `onBackToRoles: () => void` - Callback para volver a selección de roles

### TwoFactorForm
**Responsabilidad:** Campo de código 2FA de 6 dígitos

**Props:**
- `register: UseFormRegister<LoginFormData>` - React Hook Form register
- `errors: FieldErrors<LoginFormData>` - Errores de validación
- `isSubmitting: boolean` - Estado de loading
- `setValue: UseFormSetValue<LoginFormData>` - Para limpiar el código
- `onBack: () => void` - Callback para volver al login normal

## 🪝 Custom Hook

### useLoginAuth
**Ubicación:** `../hooks/useLoginAuth.ts`

**Responsabilidad:** Maneja toda la lógica de autenticación

**Returns:**
- `requires2FA: boolean` - Si requiere 2FA
- `loginCredentials: LoginCredentials | null` - Credenciales guardadas para 2FA
- `handleLogin: (data) => Promise<void>` - Maneja el login normal
- `handle2FAVerification: (data) => Promise<void>` - Maneja la verificación 2FA
- `resetAuth: () => void` - Resetea el estado de autenticación

## 🔄 Flujo de Uso

```tsx
// 1. Usuario ve la lista de roles
<RoleSelector onRoleSelect={handleRoleSelect} />

// 2. Selecciona un rol → Muestra formulario de login
<LoginCard>
  <LoginFormFields /> // Email y password
</LoginCard>

// 3a. Login exitoso → Redirige al dashboard del rol
// 3b. Requiere 2FA → Muestra formulario 2FA
<LoginCard>
  <TwoFactorForm /> // Código de 6 dígitos
</LoginCard>

// 4. Verificación 2FA exitosa → Redirige al dashboard
```

## ✅ Beneficios de la Modularización

1. **Separación de responsabilidades**: Cada componente tiene una única responsabilidad
2. **Reutilización**: Los componentes pueden usarse independientemente
3. **Testeo más fácil**: Cada componente se puede testear por separado
4. **Mantenibilidad**: Cambios en un componente no afectan a otros
5. **Legibilidad**: El código es más fácil de entender y navegar
6. **Escalabilidad**: Fácil agregar nuevos features sin modificar todo

## 📦 Import Example

```tsx
// Importar componentes individuales
import { RoleSelector, LoginCard } from "./login"

// O importar todo
import * as LoginComponents from "./login"
```
