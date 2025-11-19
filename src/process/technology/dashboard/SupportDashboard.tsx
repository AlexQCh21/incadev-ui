import { useState, useEffect } from "react"
import { TechnologyLayout } from "../components/TechnologyLayout"
import { useTechnologyAuth } from "../hooks/useTechnologyAuth"
import { technologyApi } from "@/services/tecnologico/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Loader2,
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import { toast } from "sonner"
import type { SupportStatistics } from "@/types/support"

export default function SupportDashboard() {
  const { user, loading: authLoading } = useTechnologyAuth()
  const [stats, setStats] = useState<SupportStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    if (!authLoading && user) {
      fetchStatistics()
    }
  }, [period, authLoading, user])

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const response = await technologyApi.support.statistics(period)
      if (response.status === "success" && response.data) {
        setStats(response.data.statistics)
      } else {
        toast.error("Error al cargar estadísticas")
      }
    } catch (error: any) {
      console.error("Error fetching statistics:", error)
      toast.error(error.message || "Error al cargar estadísticas")
    } finally {
      setLoading(false)
    }
  }

  const getPeriodLabel = () => {
    switch (period) {
      case "today": return "Hoy"
      case "week": return "Esta Semana"
      case "month": return "Este Mes"
      case "year": return "Este Año"
      default: return "Este Mes"
    }
  }

  if (authLoading) {
    return (
      <TechnologyLayout breadcrumbs={[{ label: "Dashboard de Soporte" }]}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </TechnologyLayout>
    )
  }

  return (
    <TechnologyLayout
      breadcrumbs={[
        { label: "Dashboard de Soporte" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Soporte</h1>
            <p className="text-sm text-gray-600 mt-1">
              Estadísticas y métricas del sistema de tickets
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Período:</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
                <SelectItem value="year">Este Año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : stats ? (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Tickets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total de Tickets
                  </CardTitle>
                  <Ticket className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total_tickets}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPeriodLabel()}
                  </p>
                </CardContent>
              </Card>

              {/* Open Tickets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tickets Abiertos
                  </CardTitle>
                  <AlertCircle className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.open_tickets}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total_tickets > 0
                      ? `${Math.round((stats.open_tickets / stats.total_tickets) * 100)}% del total`
                      : "0% del total"
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Pending Tickets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tickets Pendientes
                  </CardTitle>
                  <Clock className="w-4 h-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending_tickets}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total_tickets > 0
                      ? `${Math.round((stats.pending_tickets / stats.total_tickets) * 100)}% del total`
                      : "0% del total"
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Closed Tickets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tickets Cerrados
                  </CardTitle>
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.closed_tickets}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total_tickets > 0
                      ? `${Math.round((stats.closed_tickets / stats.total_tickets) * 100)}% del total`
                      : "0% del total"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Distribución por Prioridad
                </CardTitle>
                <CardDescription>Tickets clasificados por nivel de prioridad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">Baja</span>
                      <span className="text-2xl font-bold text-blue-700">
                        {stats.by_priority.low}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_priority.low / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-700">Media</span>
                      <span className="text-2xl font-bold text-yellow-700">
                        {stats.by_priority.medium}
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_priority.medium / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-700">Alta</span>
                      <span className="text-2xl font-bold text-orange-700">
                        {stats.by_priority.high}
                      </span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_priority.high / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-700">Urgente</span>
                      <span className="text-2xl font-bold text-red-700">
                        {stats.by_priority.urgent}
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_priority.urgent / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Distribución por Tipo
                </CardTitle>
                <CardDescription>Tickets clasificados por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">Técnico</span>
                      <span className="text-2xl font-bold text-purple-700">
                        {stats.by_type.technical}
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_type.technical / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-700">Académico</span>
                      <span className="text-2xl font-bold text-indigo-700">
                        {stats.by_type.academic}
                      </span>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_type.academic / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-pink-700">Administrativo</span>
                      <span className="text-2xl font-bold text-pink-700">
                        {stats.by_type.administrative}
                      </span>
                    </div>
                    <div className="w-full bg-pink-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_type.administrative / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-cyan-700">Consulta</span>
                      <span className="text-2xl font-bold text-cyan-700">
                        {stats.by_type.inquiry}
                      </span>
                    </div>
                    <div className="w-full bg-cyan-200 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{
                          width: stats.total_tickets > 0
                            ? `${(stats.by_type.inquiry / stats.total_tickets) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {(stats.average_response_time || stats.average_resolution_time) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.average_response_time && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Tiempo Promedio de Respuesta
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.average_response_time}</div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tiempo promedio para la primera respuesta
                      </p>
                    </CardContent>
                  </Card>
                )}

                {stats.average_resolution_time && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Tiempo Promedio de Resolución
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.average_resolution_time}</div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tiempo promedio para cerrar un ticket
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Today's Activity */}
            {(stats.tickets_created_today !== undefined || stats.tickets_resolved_today !== undefined) && (
              <Card>
                <CardHeader>
                  <CardTitle>Actividad de Hoy</CardTitle>
                  <CardDescription>Tickets creados y resueltos en las últimas 24 horas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.tickets_created_today !== undefined && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Tickets Creados</p>
                          <p className="text-2xl font-bold text-green-700">
                            {stats.tickets_created_today}
                          </p>
                        </div>
                      </div>
                    )}

                    {stats.tickets_resolved_today !== undefined && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <TrendingDown className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Tickets Resueltos</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {stats.tickets_resolved_today}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button onClick={() => window.location.href = "/tecnologico/support/tickets"}>
                  Ver Todos los Tickets
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/tecnologico/support/tickets?status=open"}
                >
                  Tickets Abiertos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/tecnologico/support/tickets?priority=urgent"}
                >
                  Tickets Urgentes
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </TechnologyLayout>
  )
}
