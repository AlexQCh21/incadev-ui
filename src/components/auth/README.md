# Sistema de Autenticación Basado en Roles - INCADEV

Sistema completo de autenticación que permite a los usuarios seleccionar su rol antes de iniciar sesión.

## Estructura de Componentes

### 1. RoleBasedAuth (Componente Principal)
Componente raíz que maneja el flujo completo de autenticación:
- Selección de rol
- Formulario de login
- Navegación entre estados

**Ubicación:** `src/components/auth/RoleBasedAuth.tsx`

### 2. RoleSelector
Interfaz de selección de roles con las siguientes características:
- Búsqueda por nombre o descripción
- Filtros por grupo funcional
- Tarjetas de rol con iconos personalizados
- Diseño responsive (grid adaptable)

**Ubicación:** `src/components/auth/RoleSelector.tsx`

### 3. RoleLoginForm
Formulario de inicio de sesión específico para cada rol:
- Campos: email y contraseña
- Validación de formulario
- Estados: loading, error, success
- Opción de "olvidé mi contraseña"
- Botón para volver a selección de roles

**Ubicación:** `src/components/auth/RoleLoginForm.tsx`

## Tipos y Datos

### Definición de Roles
**Ubicación:** `src/types/roles.ts`

Contiene:
- Interface `Role`: estructura de datos de cada rol
- Interface `RoleGroup`: agrupación de roles
- Array `ROLES`: todos los roles del sistema (24 roles)
- Array `ROLE_GROUPS`: 7 grupos funcionales
- Funciones helper: `getRoleById()`, `getRolesByGroup()`, etc.

### Grupos de Roles

1. **Soporte y Administración** (6 roles)
   - Administrador, Soporte Técnico, Infraestructura, Seguridad, Analista Académico, Desarrollador Web

2. **Auditoría y Encuestas** (3 roles)
   - Administrador de Encuestas, Jefe de Auditores, Auditor

3. **Recursos Humanos y Finanzas** (5 roles)
   - RRHH, Gerente Financiero, Visualizador del Sistema, Gerente de Matrículas, Analista de Datos

4. **Marketing** (2 roles)
   - Empleado de Marketing, Administrador de Marketing

5. **Académico** (2 roles)
   - Profesor/Docente, Estudiante

6. **Tutorías y Administración** (2 roles)
   - Tutor/Psicólogo, Empleado Administrativo

7. **Planificación y Mejora Continua** (3 roles)
   - Administrador de Planificación, Planificador, Mejora Continua

## Página de Acceso

**URL:** `/login-modules`
**Archivo:** `src/pages/login-modules.astro`

## Uso

### En una página Astro:
```astro
---
import { RoleBasedAuth } from '@/components/auth/RoleBasedAuth';
---

<RoleBasedAuth client:load />
```

### Personalización de Iconos
Los iconos se mapean en cada componente usando `lucide-react`:
```typescript
const iconMap: Record<string, any> = {
  Shield, LifeBuoy, Server, // ... etc
};
```

### Flujo de Autenticación
1. Usuario accede a `/login-modules`
2. Ve todas las tarjetas de categorías de módulos organizadas
3. Puede buscar o filtrar módulos
4. Selecciona una categoría haciendo clic en la tarjeta
5. Se muestra la página de login del módulo seleccionado
6. Selecciona un rol específico dentro del módulo
7. Ingresa credenciales (email + password)
8. Sistema valida y redirige al dashboard correspondiente

## Componentes shadcn/ui Utilizados

- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Button`
- `Input`
- `Label`
- `Badge`
- `Alert`, `AlertDescription`

## Próximos Pasos

### Integración con Backend
```typescript
// En RoleLoginForm.tsx, reemplazar simulación con API real:
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, role: role.id })
});
```

### Redirección por Rol
Crear función que mapee roles a sus dashboards correspondientes:
```typescript
function getDashboardByRole(roleId: string): string {
  const dashboards = {
    admin: '/admin/dashboard',
    teacher: '/academico/dashboard',
    student: '/academico/dashboard',
    // ... etc
  };
  return dashboards[roleId] || '/dashboard';
}
```

### Gestión de Sesión
- Implementar almacenamiento de token JWT
- Middleware de autenticación
- Protección de rutas por rol
- Refresh token

## Notas Técnicas

- Todos los roles usan `guard_name: 'web'`
- Los permisos siguen el formato: `{modelo}.{acción}`
- Componentes React con `"use client"`
- Compatible con Astro islands architecture
- Diseño responsive con Tailwind CSS
