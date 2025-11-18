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
import { Plus, Search, Eye, Pencil, Trash2, RotateCcw } from "lucide-react"
import { technologyApi } from "@/services/tecnologico/api"
import type { News, NewsCategory } from "@/types/developer-web"
import { NewsForm } from "@/process/technology/dashboard/NewsForm"

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadNews()
    loadCategories()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await technologyApi.developerWeb.news.list({
        search: search || undefined,
        category: categoryFilter !== "all" ? Number(categoryFilter) : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      if (response.success && response.data) {
        setNews(response.data.data || response.data)
      }
    } catch (error) {
      console.error("Error al cargar noticias:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await technologyApi.developerWeb.news.categories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  const handleDelete = async () => {
    if (!newsToDelete) return
    try {
      await technologyApi.developerWeb.news.delete(newsToDelete)
      loadNews()
      setDeleteDialogOpen(false)
      setNewsToDelete(null)
    } catch (error) {
      console.error("Error al eliminar noticia:", error)
    }
  }

  const handleResetViews = async (id: number) => {
    try {
      await technologyApi.developerWeb.news.resetViews(id)
      loadNews()
    } catch (error) {
      console.error("Error al resetear vistas:", error)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedNews(null)
    loadNews()
  }

  return (
    <TechnologyLayout breadcrumbs={[{ label: "Noticias" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
            <p className="text-muted-foreground">
              Administra las noticias del portal tecnológico
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Noticia
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
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
            <Button onClick={loadNews} variant="outline">
              Buscar
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Cargando noticias...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron noticias</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categorías</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Vistas</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.categories?.map((cat) => (
                          <Badge key={cat.id} variant="outline" className="text-xs">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
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
                            setSelectedNews(item)
                            setIsFormOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setNewsToDelete(item.id)
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
              {selectedNews ? "Editar Noticia" : "Nueva Noticia"}
            </DialogTitle>
            <DialogDescription>
              {selectedNews
                ? "Modifica los datos de la noticia"
                : "Completa el formulario para crear una nueva noticia"}
            </DialogDescription>
          </DialogHeader>
          <NewsForm
            news={selectedNews}
            categories={categories}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedNews(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
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