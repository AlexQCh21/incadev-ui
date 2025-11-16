# Guía de Implementación del Módulo de Soporte

## Estado Actual de Implementación

### ✅ Completado

1. **Configuración de Endpoints** (`src/config/technology-config.ts`)
   - Endpoints para tickets, respuestas, archivos adjuntos y estadísticas
   - Estructura completa de API configurada

2. **Tipos TypeScript** (`src/types/support.ts`)
   - Interfaces completas: Ticket, TicketReply, Attachment, User
   - Tipos: TicketType, TicketStatus, TicketPriority
   - Labels y colores para UI
   - Tipos de filtros y respuestas de API

3. **API Client** (`src/services/tecnologico/api.ts`)
   - `technologyApi.support.tickets.*` - CRUD completo de tickets
   - `technologyApi.support.replies.*` - Gestión de respuestas con archivos
   - `technologyApi.support.attachments.*` - Descarga y eliminación de archivos
   - `technologyApi.support.statistics()` - Estadísticas del dashboard

4. **Componente TicketsPage** (`src/process/technology/dashboard/TicketsPage.tsx`)
   - Lista de tickets con tabla responsive
   - Filtros por estado, prioridad, tipo
   - Búsqueda por título
   - Paginación
   - Navegación a detalle y crear ticket

### 📝 Pendiente de Implementar

Los siguientes archivos necesitan ser creados para completar el módulo:

---

## 1. CreateTicketPage.tsx

**Ruta**: `src/process/technology/dashboard/CreateTicketPage.tsx`

**Funcionalidad**:
- Formulario para crear nuevo ticket
- Campos: título, tipo, prioridad, contenido
- Validación con React Hook Form + Zod
- Redirección al ticket creado después de guardarlo

**Patrón a seguir**: Ver `UsersPage.tsx` para el patrón de formularios con Dialog

**Esquema mínimo**:
```tsx
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { technologyApi } from "@/services/tecnologico/api"
import { TechnologyLayout } from "../components/TechnologyLayout"
// ... imports de UI components

const schema = z.object({
  title: z.string().min(1, "El título es requerido").max(255),
  type: z.enum(["technical", "academic", "administrative", "inquiry"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
})

export default function CreateTicketPage() {
  const form = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    const response = await technologyApi.support.tickets.create(data)
    if (response.status === "success") {
      toast.success("Ticket creado exitosamente")
      window.location.href = `/tecnologico/support/tickets/${response.data.ticket.id}`
    }
  }

  return (
    <TechnologyLayout breadcrumbs={[/*...*/]}>
      {/* Formulario con Card, Form, Inputs, Selects, Textarea */}
    </TechnologyLayout>
  )
}
```

---

## 2. TicketDetailPage.tsx

**Ruta**: `src/process/technology/dashboard/TicketDetailPage.tsx`

**Funcionalidad**:
- Muestra información del ticket (título, estado, prioridad, tipo)
- Lista de respuestas con avatars y timestamps
- Formulario para agregar nueva respuesta
- Soporte para archivos adjuntos (hasta 5 archivos, máx 10MB)
- Botones para cerrar/reabrir ticket
- Botones para actualizar estado/prioridad (solo soporte)

**Componentes necesarios**:
- Header con badge de estado y prioridad
- Timeline de respuestas
- Formulario de respuesta con upload de archivos
- Acciones (cerrar, reabrir, editar)

**Props**: Recibe `ticketId` de la URL

**Esquema mínimo**:
```tsx
import { useState, useEffect } from "react"
import { technologyApi } from "@/services/tecnologico/api"
import type { Ticket, TicketReply } from "@/types/support"

export default function TicketDetailPage({ ticketId }: { ticketId: number }) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  const fetchTicket = async () => {
    const response = await technologyApi.support.tickets.getById(ticketId)
    if (response.status === "success") {
      setTicket(response.data.ticket)
    }
    setLoading(false)
  }

  const handleAddReply = async () => {
    const response = await technologyApi.support.replies.create(
      ticketId,
      replyContent,
      attachments
    )
    if (response.status === "success") {
      setReplyContent("")
      setAttachments([])
      fetchTicket() // Reload ticket
    }
  }

  const handleCloseTicket = async () => {
    await technologyApi.support.tickets.close(ticketId)
    fetchTicket()
  }

  return (
    <TechnologyLayout breadcrumbs={[/*...*/]}>
      {/* Ticket header */}
      {/* Replies timeline */}
      {/* Reply form with file upload */}
    </TechnologyLayout>
  )
}
```

---

## 3. SupportDashboard.tsx

**Ruta**: `src/process/technology/dashboard/SupportDashboard.tsx`

**Funcionalidad**:
- Estadísticas generales (total, abiertos, pendientes, cerrados)
- Gráficos de tickets por prioridad y tipo
- Tiempos promedio de respuesta y resolución
- Tickets creados/resueltos hoy
- Solo visible para rol `support` y `admin`

**Componentes**:
- Cards con estadísticas numéricas
- Gráficos de barras/pie (opcional, usar recharts si está disponible)
- Selector de período (today, week, month, year)

**Esquema mínimo**:
```tsx
import { useState, useEffect } from "react"
import { technologyApi } from "@/services/tecnologico/api"
import type { SupportStatistics } from "@/types/support"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Clock, CheckCircle2 } from "lucide-react"

export default function SupportDashboard() {
  const [stats, setStats] = useState<SupportStatistics | null>(null)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    fetchStatistics()
  }, [period])

  const fetchStatistics = async () => {
    const response = await technologyApi.support.statistics(period)
    if (response.status === "success") {
      setStats(response.data.statistics)
    }
  }

  return (
    <TechnologyLayout breadcrumbs={[{label: "Dashboard de Soporte"}]}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total_tickets || 0}</div>
          </CardContent>
        </Card>
        {/* Más cards con estadísticas */}
      </div>
    </TechnologyLayout>
  )
}
```

---

## 4. Páginas Astro

### 4.1 `/src/pages/tecnologico/support/dashboard.astro`

```astro
---
import SupportDashboard from '@/process/technology/dashboard/SupportDashboard';
import '@/styles/global.css';
---

<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard de Soporte - Tecnológico</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <SupportDashboard client:load />
</body>
</html>
```

### 4.2 `/src/pages/tecnologico/support/tickets.astro`

```astro
---
import TicketsPage from '@/process/technology/dashboard/TicketsPage';
import '@/styles/global.css';
---

<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <title>Tickets de Soporte - Tecnológico</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <TicketsPage client:load />
</body>
</html>
```

### 4.3 `/src/pages/tecnologico/support/tickets/crear.astro`

```astro
---
import CreateTicketPage from '@/process/technology/dashboard/CreateTicketPage';
import '@/styles/global.css';
---

<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <title>Crear Ticket - Tecnológico</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <CreateTicketPage client:load />
</body>
</html>
```

### 4.4 `/src/pages/tecnologico/support/tickets/[id].astro`

```astro
---
import TicketDetailPage from '@/process/technology/dashboard/TicketDetailPage';
import '@/styles/global.css';

const { id } = Astro.params;
const ticketId = parseInt(id || '0', 10);
---

<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <title>Ticket #{id} - Tecnológico</title>
  <meta name="robots" content="noindex, nofollow" />
</head>
<body>
  <TicketDetailPage client:load ticketId={ticketId} />
</body>
</html>
```

---

## 5. Actualizar Sidebar

**Archivo**: `src/process/technology/components/sidebar/TechAppSidebar.tsx`

**Cambios necesarios**:

Buscar la función `getNavigationForRole` y agregar la navegación para el rol `support`:

```tsx
const navItems = {
  // ...
  support: [
    {
      title: "Dashboard",
      url: "/tecnologico/support/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tickets",
      url: "/tecnologico/support/tickets",
      icon: Ticket,
      isActive: true,
    },
    {
      title: "Perfil",
      url: "/tecnologico/support/perfil",
      icon: User,
    },
  ],
  // ...
}
```

**Imports necesarios**:
```tsx
import { Ticket } from "lucide-react"
```

---

## 6. Actualizar Rutas

**Archivo**: `src/process/technology/technology-site.ts`

**Cambios necesarios**:

```tsx
export const routes = {
  dashboard: {
    admin: "/tecnologico/admin/dashboard",
    support: "/tecnologico/support/dashboard", // AGREGAR
    // ...
  },
  support: { // AGREGAR SECCIÓN COMPLETA
    dashboard: "/tecnologico/support/dashboard",
    tickets: "/tecnologico/support/tickets",
    createTicket: "/tecnologico/support/tickets/crear",
    ticketDetail: (id: number) => `/tecnologico/support/tickets/${id}`,
    profile: "/tecnologico/support/perfil",
  },
  // ...
}
```

---

## 7. Componentes UI Adicionales Necesarios

Verificar que existan los siguientes componentes de shadcn/ui:

- ✅ Card
- ✅ Button
- ✅ Input
- ✅ Select
- ✅ Badge
- ✅ Table
- ✅ Alert Dialog
- ⚠️ Textarea - Si no existe, instalar:
  ```bash
  npx shadcn@latest add textarea
  ```
- ⚠️ Avatar - Si no existe, instalar:
  ```bash
  npx shadcn@latest add avatar
  ```

---

## 8. Pruebas de Integración

### Checklist de Funcionalidad

**Lista de Tickets**:
- [ ] Ver lista de tickets propios
- [ ] Filtrar por estado, prioridad, tipo
- [ ] Buscar por título
- [ ] Paginación funcional
- [ ] Click en fila navega a detalle

**Crear Ticket**:
- [ ] Formulario validado correctamente
- [ ] Crear ticket exitosamente
- [ ] Redirección al ticket creado

**Detalle de Ticket**:
- [ ] Ver información del ticket
- [ ] Ver todas las respuestas
- [ ] Agregar respuesta
- [ ] Adjuntar archivos (máx 5, 10MB)
- [ ] Cerrar ticket
- [ ] Reabrir ticket cerrado

**Dashboard de Soporte** (solo soporte/admin):
- [ ] Ver estadísticas generales
- [ ] Filtrar por período
- [ ] Gráficos de distribución

**Permisos**:
- [ ] Usuarios solo ven sus propios tickets
- [ ] Soporte ve todos los tickets
- [ ] Admin tiene acceso completo

---

## 9. Mejoras Futuras

1. **Notificaciones en Tiempo Real**:
   - WebSockets para notificar nuevas respuestas
   - Badge contador en sidebar

2. **Sistema de Búsqueda Avanzada**:
   - Búsqueda por ID, usuario, fechas
   - Búsqueda en contenido de respuestas

3. **Exportación de Datos**:
   - Exportar tickets a CSV/Excel
   - Generar reportes PDF

4. **Asignación de Tickets**:
   - Asignar tickets a miembros del equipo de soporte
   - Cola de tickets sin asignar

5. **Plantillas de Respuestas**:
   - Respuestas rápidas predefinidas
   - Macros para respuestas comunes

6. **Sistema de Calificación**:
   - Usuarios pueden calificar la atención recibida
   - Métricas de satisfacción del cliente

---

## 10. Notas de Seguridad

- **Validación de Archivos**: El backend debe validar tipos MIME y tamaños
- **XSS Prevention**: Sanitizar contenido HTML en respuestas
- **Rate Limiting**: Implementar límites en creación de tickets
- **Autorización**: Verificar permisos en cada endpoint

---

## Estructura Final de Archivos

```
src/
├── config/
│   └── technology-config.ts ✅
├── types/
│   └── support.ts ✅
├── services/tecnologico/
│   └── api.ts ✅
├── process/technology/
│   ├── components/
│   │   ├── sidebar/
│   │   │   └── TechAppSidebar.tsx ⏳
│   │   └── TechnologyLayout.tsx ✅
│   ├── dashboard/
│   │   ├── TicketsPage.tsx ✅
│   │   ├── CreateTicketPage.tsx ⏳
│   │   ├── TicketDetailPage.tsx ⏳
│   │   └── SupportDashboard.tsx ⏳
│   └── technology-site.ts ⏳
└── pages/tecnologico/support/
    ├── dashboard.astro ⏳
    ├── tickets.astro ⏳
    └── tickets/
        ├── crear.astro ⏳
        └── [id].astro ⏳
```

**Leyenda**:
- ✅ Completado
- ⏳ Pendiente

---

## Contacto y Soporte

Para cualquier duda sobre la implementación, consultar:
- [API_CONTRACTS.md](./API_CONTRACTS.md) - Especificación completa de la API
- [SUPPORT_MODULE_IMPLEMENTATION_GUIDE.md](./SUPPORT_MODULE_IMPLEMENTATION_GUIDE.md) - Esta guía

---

**Última actualización**: 2025-11-15
