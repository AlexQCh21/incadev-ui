import TechnologyLayout from "@/process/technology/TechnologyLayout"

export default function AcademicAnalystDashboard() {
  return (
    <TechnologyLayout title="Dashboard: Analista Académico">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Dashboard Analista Académico</h1>
          <p className="text-muted-foreground">
            Análisis de Datos Académicos y Reportes
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Dashboard de análisis académico en desarrollo...</p>
        </div>
      </div>
    </TechnologyLayout>
  )
}
