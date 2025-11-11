import TechnologyLayout from "@/process/technology/TechnologyLayout"
import { IconTicket, IconClock, IconCheck, IconBook, IconUsers, IconChartBar } from "@tabler/icons-react"

export default function SupportDashboard() {
  return (
    <TechnologyLayout title="Dashboard: Soporte Técnico">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Dashboard Soporte Técnico</h1>
          <p className="text-muted-foreground">
            Gestión de Tickets y Solución de Problemas Técnicos
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Tickets Pendientes */}
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <IconClock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold">Tickets Pendientes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestión de tickets sin resolver
            </p>
          </div>

          {/* Card 2: Tickets en Proceso */}
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <IconTicket className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold">En Proceso</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Tickets actualmente en atención
            </p>
          </div>

          {/* Card 3: Tickets Resueltos */}
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <IconCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">Resueltos</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Historial de tickets completados
            </p>
          </div>

          {/* Card 4: Base de Conocimientos */}
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <IconBook className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold">Base de Conocimientos</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Soluciones y documentación técnica
            </p>
          </div>

          {/* Card 5: Atención a Usuarios */}
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <IconUsers className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold">Atención a Usuarios</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestión de solicitudes de usuarios
            </p>
          </div>

          {/* Card 6: Reportes */}
          <div className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <IconChartBar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold">Reportes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Estadísticas de soporte técnico
            </p>
          </div>
        </div>
      </div>
    </TechnologyLayout>
  )
}
