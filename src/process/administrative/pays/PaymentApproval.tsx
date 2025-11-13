import AdministrativeLayout from '@/process/administrative/AdministrativeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentApproval() {
  return (
    <AdministrativeLayout title="Validar Pagos">
      <div className="p-6 space-y-6">
        
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-gradient-to-br from-sky-500 to-sky-700 px-6 py-7 shadow-xl">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/90">Gestión Financiera</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Validar Pagos</h1>
            <p className="mt-2 max-w-xl text-sm text-sky-100/80">
              Revisa y aprueba los pagos pendientes de validación
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Validación de Pagos</CardTitle>
            <CardDescription>El contenido se agregará próximamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Contenido en construcción...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdministrativeLayout>
  );
}
