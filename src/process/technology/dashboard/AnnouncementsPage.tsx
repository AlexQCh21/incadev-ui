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
import { Plus, Search, Eye, Pencil, Trash2, RotateCcw, Pin } from "lucide-react"
import { technologyApi } from "@/services/tecnologico/api"
import type { Announcement } from "@/types/developer-web"
import { AnnouncementImportanceLabels, AnnouncementImportanceColors } from "@/types/developer-web"
import { AnnouncementForm } from "@/process/technology/dashboard/AnnouncementForm"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [importanceFilter, setImportanceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await technologyApi.developerWeb.announcements.list({
        search: search || undefined,
        importance: importanceFilter !== "all" ? importanceFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      if (response.success && response.data) {
        setAnnouncements(response.data.data || response.data)
      }
    } catch (error) {
      console.error("Error al cargar anuncios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!announcementToDelete) return
    try {
      await technologyApi.developerWeb.announcements.delete(announcementToDelete)
      loadAnnouncements()
      setDeleteDialogOpen(false)
      setAnnouncementToDelete(null)
    } catch (error) {
      console.error("Error al eliminar anuncio:", error)
    }
  }

  const handleResetViews = async (id: number) => {
    try {
      await technologyApi.developerWeb.announcements.resetViews(id)
      loadAnnouncements()
    } catch (error) {
      console.error("Error al resetear vistas:", error)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedAnnouncement(null)
    loadAnnouncements()
  }

  return (
    <TechnologyLayout breadcrumbs={[{ label: "Anuncios" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Anuncios</h1>
            <p className="text-muted-foreground">
              Administra los anuncios importantes del portal
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Anuncio
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
            <Select value={importanceFilter} onValueChange={setImportanceFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Importancia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las importancias</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadAnnouncements} variant="outline">
              Buscar
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Cargando anuncios...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron anuncios</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Importancia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Vistas</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.is_sticky && (
                          <Pin className="h-4 w-4 text-blue-500" />
                        )}
                        {item.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={AnnouncementImportanceColors[item.importance]}
                      >
                        {AnnouncementImportanceLabels[item.importance]}
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
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{item.views_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResetViews(item.id)}
                          title="Resetear vistas"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAnnouncement(item)
                            setIsFormOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setAnnouncementToDelete(item.id)
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
              {selectedAnnouncement ? "Editar Anuncio" : "Nuevo Anuncio"}
            </DialogTitle>
            <DialogDescription>
              {selectedAnnouncement
                ? "Modifica los datos del anuncio"
                : "Completa el formulario para crear un nuevo anuncio"}
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm
            announcement={selectedAnnouncement}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedAnnouncement(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio será eliminado permanentemente.
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