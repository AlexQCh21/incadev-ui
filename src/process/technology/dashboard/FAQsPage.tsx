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
import { Plus, Search, Eye, Pencil, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"
import { technologyApi } from "@/services/tecnologico/api"
import type { FAQ, FAQCategory } from "@/types/developer-web"
import { FAQForm } from "@/process/technology/dashboard/FAQForm"

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadFAQs()
    loadCategories()
  }, [])

  const loadFAQs = async () => {
    try {
      setLoading(true)
      const response = await technologyApi.developerWeb.faqs.list({
        search: search || undefined,
        category: categoryFilter !== "all" ? Number(categoryFilter) : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      if (response.success && response.data) {
        setFaqs(response.data.data || response.data)
      }
    } catch (error) {
      console.error("Error al cargar FAQs:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await technologyApi.developerWeb.faqs.categories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  const handleDelete = async () => {
    if (!faqToDelete) return
    try {
      await technologyApi.developerWeb.faqs.delete(faqToDelete)
      loadFAQs()
      setDeleteDialogOpen(false)
      setFaqToDelete(null)
    } catch (error) {
      console.error("Error al eliminar FAQ:", error)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedFAQ(null)
    loadFAQs()
  }

  const getHelpfulRate = (faq: FAQ) => {
    const total = faq.helpful_count + faq.not_helpful_count
    if (total === 0) return "N/A"
    return `${Math.round((faq.helpful_count / total) * 100)}%`
  }

  return (
    <TechnologyLayout breadcrumbs={[{ label: "FAQs" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de FAQs</h1>
            <p className="text-muted-foreground">
              Administra las preguntas frecuentes
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva FAQ
          </Button>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por pregunta..."
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
            <Button onClick={loadFAQs} variant="outline">
              Buscar
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Cargando FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron FAQs</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pregunta</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Vistas</TableHead>
                  <TableHead className="text-center">Utilidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-md">
                      {item.question}
                    </TableCell>
                    <TableCell>
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category.name}
                        </Badge>
                      )}
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
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-xs">{item.helpful_count}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <ThumbsDown className="h-3 w-3" />
                          <span className="text-xs">{item.not_helpful_count}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({getHelpfulRate(item)})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFAQ(item)
                            setIsFormOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setFaqToDelete(item.id)
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
              {selectedFAQ ? "Editar FAQ" : "Nueva FAQ"}
            </DialogTitle>
            <DialogDescription>
              {selectedFAQ
                ? "Modifica los datos de la pregunta frecuente"
                : "Completa el formulario para crear una nueva pregunta frecuente"}
            </DialogDescription>
          </DialogHeader>
          <FAQForm
            faq={selectedFAQ}
            categories={categories}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedFAQ(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La FAQ será eliminada permanentemente.
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