import { useState, useEffect } from 'react';
import AdministrativeLayout from '@/process/administrative/AdministrativeLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { config } from '@/config/administrative-config';
import { IconFileText, IconDownload, IconSearch, IconFileTypeCsv, IconFileTypePdf } from '@tabler/icons-react';

interface Payment {
  payment_id: number;
  student_name: string;
  payment_method: string;
  amount: number;
  payment_date: string;
  status: string;
}

interface Stats {
  monthly_income: number;
  monthly_variation: number | null;
  pending_amount: number;
  pending_students: number;
  collection_rate: number | null;
}

interface StatusBreakdown {
  paid?: number;
  completed?: number;
  pending?: number;
  failed?: number;
  cancelled?: number;
  partial?: number;
}

interface PaymentsData {
  payments: Payment[];
  stats: Stats;
  status_breakdown: StatusBreakdown;
}

export default function PaymentsHistory() {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, allPayments]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const apiUrl = `${config.apiUrl}${config.endpoints.pagos}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: PaymentsData = await response.json();
      setStats(data.stats);
      setStatusBreakdown(data.status_breakdown);
      setAllPayments(data.payments);
      setFilteredPayments(data.payments);
      setError(null);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      setFilteredPayments([...allPayments]);
    } else {
      const filtered = allPayments.filter((payment) => {
        const studentName = (payment.student_name || '').toLowerCase();
        const paymentId = `p-${String(payment.payment_id).padStart(3, '0')}`.toLowerCase();
        return studentName.includes(lowerQuery) || paymentId.includes(lowerQuery);
      });
      setFilteredPayments(filtered);
    }
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const url = `${config.apiUrl}${config.endpoints.pagosExportCsv}`;
    window.open(url, '_blank');
  };

  const exportPDF = () => {
    const url = config.endpoints.pagosExportData;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('paymentsExportData', JSON.stringify(data));
        window.open('/administrativo/pagos/export-pdf', '_blank');
      })
      .catch(err => console.error('Error al cargar datos:', err));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      approved: { text: 'Aprobado', variant: 'default' },
      paid: { text: 'Pagado', variant: 'default' },
      completed: { text: 'Completado', variant: 'default' },
      pending: { text: 'Pendiente', variant: 'secondary' },
      partial: { text: 'Parcial', variant: 'outline' },
      failed: { text: 'Fallido', variant: 'destructive' },
      rejected: { text: 'Rechazado', variant: 'destructive' },
      cancelled: { text: 'Cancelado', variant: 'outline' }
    };
    const statusInfo = statusMap[status.toLowerCase()] || { text: status, variant: 'outline' };
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pagePayments = filteredPayments.slice(start, end);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AdministrativeLayout title="Historial de Pagos">
      <div className="p-6 space-y-6">
        
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-gradient-to-br from-sky-500 to-sky-700 px-6 py-7 shadow-xl">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-100/90">Gestión Financiera</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Historial de Pagos</h1>
            <p className="mt-2 max-w-xl text-sm text-sky-100/80">
              Historial de pagos realizados y pendientes
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-sky-500"></div>
              <p className="text-sm text-muted-foreground">Cargando pagos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <IconFileText className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">Error al cargar los pagos: {error}</p>
              <p className="text-xs text-muted-foreground mt-2">Verifica que el backend esté corriendo en {config.apiUrl}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats && formatCurrency(stats.monthly_income)}</div>
                  {stats && stats.monthly_variation !== null && (
                    <p className={`text-xs ${stats.monthly_variation >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stats.monthly_variation >= 0 ? '+' : ''}{stats.monthly_variation.toFixed(1)}% vs mes anterior
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats && formatCurrency(stats.pending_amount)}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pending_students} estudiantes con deuda
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de cobro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats && stats.collection_rate !== null ? `${stats.collection_rate.toFixed(1)}%` : '--%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pagos completados sobre facturas emitidas
                  </p>
                </CardContent>
              </Card>
            </div>

            {statusBreakdown && Object.keys(statusBreakdown).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Estado de pagos</CardTitle>
                  <CardDescription>Distribución actual de los registros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(statusBreakdown).map(([status, count]) => {
                      const labels: Record<string, string> = {
                        paid: 'Pagados',
                        completed: 'Completados',
                        pending: 'Pendientes',
                        failed: 'Fallidos',
                        cancelled: 'Cancelados',
                        partial: 'Parciales'
                      };
                      return (
                        <Badge key={status} variant="outline">
                          {labels[status] || status} · {count}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle>Registro de pagos</CardTitle>
                    <CardDescription>Historial de pagos realizados y pendientes</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">
                      {filteredPayments.length} registros
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="default" size="sm">
                          <IconDownload className="mr-2 h-4 w-4" />
                          Exportar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={exportCSV}>
                          <IconFileTypeCsv className="mr-2 h-4 w-4" />
                          CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportPDF}>
                          <IconFileTypePdf className="mr-2 h-4 w-4" />
                          PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[280px]">
                    <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar por nombre del estudiante o ID de pago..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={handleClearSearch}>
                    Limpiar
                  </Button>
                </div>

                {filteredPayments.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No hay pagos que coincidan con la búsqueda</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID Pago</TableHead>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Método</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pagePayments.map((payment) => (
                            <TableRow key={payment.payment_id}>
                              <TableCell className="font-semibold">
                                P-{String(payment.payment_id).padStart(3, '0')}
                              </TableCell>
                              <TableCell>{payment.student_name || 'Sin asignar'}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {payment.payment_method || 'Sin método'}
                              </TableCell>
                              <TableCell className="font-semibold text-sky-600 dark:text-sky-400">
                                {formatCurrency(payment.amount)}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {payment.payment_date || 'Sin fecha'}
                              </TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem('invoicePaymentId', String(payment.payment_id));
                                      window.open('/administrativo/pagos/invoice', '_blank');
                                    }}
                                    title="Emitir comprobante"
                                  >
                                    <IconFileText className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      localStorage.setItem('invoicePaymentId', String(payment.payment_id));
                                      localStorage.setItem('invoiceAutoDownload', 'true');
                                      window.open('/administrativo/pagos/invoice', '_blank');
                                    }}
                                    title="Descargar PDF"
                                  >
                                    <IconDownload className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Mostrando {start + 1}-{Math.min(end, filteredPayments.length)} de {filteredPayments.length}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={end >= filteredPayments.length}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdministrativeLayout>
  );
}
