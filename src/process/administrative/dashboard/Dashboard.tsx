import AdministrativeLayout from "@/process/administrative/AdministrativeLayout";

export default function DashboardPage() {
  return (
    <AdministrativeLayout title="Dashboard Administrativo">
      <div className="p-6">
        <h1 className="text-xl font-semibold">Dashboard Administrativo</h1>
        
        {/* Aquí va tu contenido */}
        <div className="mt-4">
          <p>Estadísticas, gráficas, tarjetas, etc.</p>
        </div>
      </div>
    </AdministrativeLayout>
  );
}
