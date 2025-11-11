import TechnologyLayout from "@/process/technology/TechnologyLayout"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TicketsPage() {
  return (
    <TechnologyLayout title="Tickets: Soporte Técnico">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Tickets</h1>
            <p className="text-muted-foreground">
              Administra y da seguimiento a los tickets de soporte
            </p>
          </div>
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tickets..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground mb-4">
            No hay tickets registrados aún
          </p>
          <p className="text-sm text-muted-foreground">
            Los tickets aparecerán aquí una vez que se creen
          </p>
        </div>
      </div>
    </TechnologyLayout>
  )
}
