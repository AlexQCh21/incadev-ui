import { useState, useEffect } from "react"
import { TechnologyLayout } from "../components/TechnologyLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { technologyApi } from "@/services/tecnologico/api"
import type { Alert } from "@/types/developer-web"
import { AlertTypeLabels, AlertTypeColors, AlertSeverityLabels, AlertSeverityColors } from "@/types/developer-web"
import { AlertForm } from "@/process/technology/dashboard/AlertForm"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [alertToDelete, setAlertToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const response = await technologyApi.developerWeb.alerts.list({
        search: search || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        severity: severityFilter !== "all" ? severityFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      if (response.success && response.data) {
        setAlerts(response.data.data || response.data)
      }
    } catch (error) {
      console.error("Error al cargar alertas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!alertToDelete) return
    try {
      await technologyApi.developerWeb.alerts.delete(alertToDelete)
      loadAlerts()
      setDeleteDialogOpen(false)
      setAlertToDelete(null)
    } catch (error) {
      console.error("Error al eliminar alerta:", error)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedAlert(null)
    loadAlerts()
  }

  return (
    <TechnologyLayout breadcrumbs={[{ label: "Alertas" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Alertas</h1>
            <p className="text-muted-foreground">
              Administra las alertas del sistema
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Alerta
          </Button>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="info">Información</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Éxito</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadAlerts} variant="outline">
              Buscar
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Cargando alertas...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron alertas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={AlertTypeColors[item.type]}
                      >
                        {AlertTypeLabels[item.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={AlertSeverityColors[item.severity]}
                      >
                        {AlertSeverityLabels[item.severity]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.is_published
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                        }
                      >
                        {item.is_published ? "Publicado" : "Borrador"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAlert(item)
                            setIsFormOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setAlertToDelete(item.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAlert ? "Editar Alerta" : "Nueva Alerta"}
            </DialogTitle>
            <DialogDescription>
              {selectedAlert
                ? "Modifica los datos de la alerta"
                : "Completa el formulario para crear una nueva alerta"}
            </DialogDescription>
          </DialogHeader>
          <AlertForm
            alert={selectedAlert}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedAlert(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La alerta será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TechnologyLayout>
  )
}