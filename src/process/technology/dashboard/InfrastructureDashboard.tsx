import TechnologyLayout from "@/process/technology/TechnologyLayout"

export default function InfrastructureDashboard() {
  return (
    <TechnologyLayout title="Dashboard: Infraestructura">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Dashboard Infraestructura</h1>
          <p className="text-muted-foreground">
            Gestión de Servidores e Infraestructura TI
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Dashboard de infraestructura en desarrollo...</p>
        </div>
      </div>
    </TechnologyLayout>
  )
}
