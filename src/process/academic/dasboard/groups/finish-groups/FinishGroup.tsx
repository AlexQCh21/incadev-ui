import AcademicLayout from "@/process/academic/AcademicLayout"
import { GroupCard, type GroupData, type APIGroupData, mapAPIGroupToGroupData } from "@/process/academic/dasboard/groups/components/GroupCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { config } from "@/config/academic-config"
import { useAcademicAuth } from "@/process/academic/hooks/useAcademicAuth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface APIResponse {
  data: APIGroupData[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

export default function FinishGroup() {
  const { token } = useAcademicAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [groups, setGroups] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<APIResponse["meta"] | null>(null)

  useEffect(() => {
    loadCompletedGroups()
  }, [token, currentPage])

  const loadCompletedGroups = async () => {
    if (!token) {
      setError("No hay token de autenticación")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const tokenWithoutQuotes = token.replace(/^"|"$/g, '')
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.groups.listComplete}?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenWithoutQuotes}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: APIResponse = await response.json()
      console.log("Grupos completados cargados:", data)
      
      const mappedGroups = data.data.map(group => ({
        ...mapAPIGroupToGroupData(group),
        status: "completed" as const,
        progress: 100
      }))
      
      setGroups(mappedGroups)
      setMeta(data.meta || null)
    } catch (error) {
      console.error("Error cargando grupos completados:", error)
      setError(error instanceof Error ? error.message : "Error desconocido al cargar grupos")
    } finally {
      setLoading(false)
    }
  }

  const handleViewCertificate = async (groupId: string) => {
    if (!token) {
      console.error("No hay token de autenticación")
      return
    }

    try {
      setDownloading(groupId)
      const tokenWithoutQuotes = token.replace(/^"|"$/g, '')
      
      // Buscar el UUID del certificado (asumiendo que viene en los datos del grupo)
      // Si no está disponible, podrías necesitar hacer otra petición para obtenerlo
      const certificateEndpoint = config.endpoints.groups.certificate.replace(':uuid', groupId)
      
      const response = await fetch(
        `${config.apiUrl}${certificateEndpoint}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenWithoutQuotes}`,
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificado-grupo-${groupId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log("Certificado descargado exitosamente")
    } catch (error) {
      console.error("Error descargando certificado:", error)
      alert("Error al descargar el certificado. Por favor, inténtalo de nuevo.")
    } finally {
      setDownloading(null)
    }
  }

  const handleExportHistory = () => {
    const csvContent = [
      ["Nombre", "Curso", "Docente", "Inicio", "Fin", "Estado"],
      ...groups.map(group => [
        group.name,
        group.course,
        group.teacher,
        group.startDate,
        group.endDate || "",
        "Completado"
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historial-academico-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const filteredGroups = groups
    .filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime()
      }
      if (sortBy === "course") {
        return a.course.localeCompare(b.course)
      }
      return 0
    })

  const getPageNumbers = () => {
    if (!meta) return []
    
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(meta.last_page, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (loading) {
    return (
      <AcademicLayout title="Grupos completados">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando grupos completados...</p>
          </div>
        </div>
      </AcademicLayout>
    )
  }

  return (
    <AcademicLayout title="Grupos completados">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">{groups.length}</div>
                  <div className="text-sm text-muted-foreground">Grupos completados</div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">{new Set(groups.map(g => g.course)).size}</div>
                  <div className="text-sm text-muted-foreground">Cursos diferentes</div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Tasa de finalización</div>
                </div>
                <div className="bg-card border rounded-lg p-4 flex items-center">
                  <Button onClick={handleExportHistory} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar historial
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en historial..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="oldest">Más antiguos</SelectItem>
                    <SelectItem value="course">Por curso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {meta && !loading && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Mostrando {meta.from} - {meta.to} de {meta.total} grupos completados
                </div>
              )}
            </div>

            {error && (
              <div className="px-4 lg:px-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="px-4 lg:px-6">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "No se encontraron grupos que coincidan con tu búsqueda" 
                      : "No tienes grupos completados aún"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <div key={group.id} className="relative">
                      <GroupCard
                        group={group}
                        variant="completed"
                        onAction={handleViewCertificate}
                        actionLabel={
                          downloading === group.id 
                            ? "Descargando..." 
                            : "Ver certificado"
                        }
                      />
                      {downloading === group.id && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!loading && !error && meta && meta.last_page > 1 && (
              <div className="px-4 lg:px-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                        className={currentPage === meta.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

          </div>
        </div>
      </div>
    </AcademicLayout>
  )
}