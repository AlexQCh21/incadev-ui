import TechnologyLayout from "@/process/technology/TechnologyLayout"

export default function WebDashboard() {
  return (
    <TechnologyLayout title="Dashboard: Desarrollo Web">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Dashboard Desarrollo Web</h1>
          <p className="text-muted-foreground">
            Gestión de Proyectos y Desarrollo Web
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Dashboard de desarrollo web en desarrollo...</p>
        </div>
      </div>
    </TechnologyLayout>
  )
}
