import { useEffect, useState } from 'react';
import AdministrativeLayout from '@/process/administrative/AdministrativeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IconCheck, IconX, IconEye } from '@tabler/icons-react';
import { config } from '@/config/administrative-config';

interface Payment {
  id: number;
  enrollment_id: number;
  operation_number: string;
  agency_number: string;
  operation_date: string;
  amount: number;
  evidence_path: string;
  status: string;
  student_name?: string | null;
}

export default function PaymentApproval() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      const apiUrl = `${config.apiUrl}${config.endpoints.pagos}`;
      const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      const all: Payment[] = data.payments || [];
      const pending = all.filter((p) => (p.status || '').toLowerCase() === 'pending');
      setPayments(pending);
      setError(null);
    } catch (err) {
      console.error('Carga de pagos fallida', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatusOptimistic = (id: number, newStatus: string) => {
    setPayments((prev) => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    const confirmMsg = action === 'approve' ? '¿Aprobar este pago y validar la matrícula?' : '¿Rechazar este pago?';
    if (!window.confirm(confirmMsg)) return;

    updatePaymentStatusOptimistic(id, action === 'approve' ? 'approved' : 'rejected');

    try {
      const url = `${config.apiUrl}/api/pagos/${id}/${action}`;
      const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        await loadPendingPayments();
        throw new Error(`Operación fallida ${res.status}`);
      }
      setPayments((prev) => prev.filter(p => p.id !== id));
      setShowEvidenceModal(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error('Error al actualizar estado del pago', err);
      setError(err instanceof Error ? err.message : 'Error al realizar la acción');
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      approved: { text: 'Aprobado', variant: 'default' },
      pending: { text: 'Pendiente', variant: 'secondary' },
      rejected: { text: 'Rechazado', variant: 'destructive' },
    };
    const statusInfo = statusMap[status.toLowerCase()] || { text: status, variant: 'outline' };
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const openEvidenceModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowEvidenceModal(true);
  };

  return (
    <AdministrativeLayout title="Validar Pagos">
      <div className="p-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-gradient-to-br from-sky-500 to-sky-700 px-6 py-7 shadow-xl">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/90">Gestión Financiera</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Validar Pagos</h1>
            <p className="mt-2 max-w-xl text-sm text-sky-100/80">Revisa y aprueba los pagos pendientes de validación</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Validación de Pagos</CardTitle>
            <CardDescription>Lista de pagos pendientes registrados por estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center">Cargando pagos pendientes...</div>
            ) : error ? (
              <div className="py-8 text-center text-sm text-red-600">Error: {error}</div>
            ) : payments.length === 0 ? (
              <div className="py-12 text-center">No hay pagos pendientes por validar</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>N° Operación</TableHead>
                      <TableHead>Agencia</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha Operación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-semibold">#{p.id}</TableCell>
                        <TableCell>{p.student_name || 'Sin asignar'}</TableCell>
                        <TableCell className="text-muted-foreground">{p.operation_number}</TableCell>
                        <TableCell className="text-muted-foreground">{p.agency_number}</TableCell>
                        <TableCell className="font-semibold text-sky-600 dark:text-sky-400">{formatCurrency(p.amount)}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(p.operation_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(p.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEvidenceModal(p)} title="Ver evidencia">
                              <IconEye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Evidencia de Pago #{selectedPayment?.id}</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Estudiante:</span> {selectedPayment.student_name || 'Sin asignar'}
                  </div>
                  <div>
                    <span className="font-semibold">N° Operación:</span> {selectedPayment.operation_number}
                  </div>
                  <div>
                    <span className="font-semibold">Agencia:</span> {selectedPayment.agency_number}
                  </div>
                  <div>
                    <span className="font-semibold">Monto:</span> {formatCurrency(selectedPayment.amount)}
                  </div>
                  <div>
                    <span className="font-semibold">Fecha:</span> {new Date(selectedPayment.operation_date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold">Estado:</span> {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <p className="text-sm font-semibold mb-2">Evidencia:</p>
                  <div className="flex justify-center bg-white dark:bg-slate-900 rounded-lg p-4">
                    <img 
                      src={`${config.apiUrl}/storage/${selectedPayment.evidence_path}`} 
                      alt="Evidencia de pago"
                      className="max-w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="18"%3ENo se pudo cargar la imagen%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowEvidenceModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={() => handleAction(selectedPayment.id, 'reject')}>
                    <IconX className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button variant="default" onClick={() => handleAction(selectedPayment.id, 'approve')}>
                    <IconCheck className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdministrativeLayout>
  );
}
