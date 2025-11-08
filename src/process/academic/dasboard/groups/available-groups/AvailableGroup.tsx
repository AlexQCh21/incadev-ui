import AcademicLayout from "@/process/academic/AcademicLayout"
import { GroupCard, type APIGroupData, mapAPIGroupToGroupData } from "@/process/academic/dasboard/groups/components/GroupCard"
import { EnrollmentModal } from "@/process/academic/dasboard/groups/available-groups/components/EnrollmentModal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Loader2, AlertCircle } from "lucide-react"
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
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

// Interfaz extendida para manejar el estado de inscripción
interface ExtendedAPIGroupData extends APIGroupData {
  user_enrollment_status?: 'pending' | 'active' | 'completed' | 'failed' | 'dropped'
}

export default function AvailableGroup() {
  const { token } = useAcademicAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [groups, setGroups] = useState<ExtendedAPIGroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState<APIResponse["meta"] | null>(null)
  
  // Estado para el modal
  const [enrollmentModal, setEnrollmentModal] = useState<{
    open: boolean
    groupId: string
    groupName: string
    courseName: string
  }>({
    open: false,
    groupId: "",
    groupName: "",
    courseName: ""
  })

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        setError(null)
        const tokenWithoutQuotes = token?.replace(/^"|"$/g, '')
        const response = await fetch(
          `${config.apiUrl}${config.endpoints.groups.available}?page=${currentPage}`,
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
        console.log("Grupos disponibles cargados:", data)
        
        // Aquí podrías enriquecer los datos con el estado de inscripción del usuario
        // Por ahora, asumimos que todos los grupos no tienen inscripción pendiente
        const groupsWithEnrollmentStatus: ExtendedAPIGroupData[] = data.data.map(group => ({
          ...group,
          user_enrollment_status: undefined // Esto vendría del backend
        }))
        
        setGroups(groupsWithEnrollmentStatus)
        setMeta(data.meta)
      } catch (error) {
        console.error("Error cargando grupos disponibles:", error)
        setError(error instanceof Error ? error.message : "Error desconocido al cargar grupos")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchGroups()
    }
  }, [token, currentPage])

  const handleJoinClick = (group: ExtendedAPIGroupData) => {
    // Verificar si ya tiene una inscripción pendiente o activa
    if (group.user_enrollment_status === 'pending' || group.user_enrollment_status === 'active') {
      return // No abrir modal si ya está inscrito o pendiente
    }

    setEnrollmentModal({
      open: true,
      groupId: group.id.toString(),
      groupName: group.name,
      courseName: group.course_name
    })
  }

  const handleEnrollmentSuccess = () => {
    // Actualizar el estado local del grupo para mostrar el botón deshabilitado
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id.toString() === enrollmentModal.groupId 
          ? { ...group, user_enrollment_status: 'pending' as const }
          : group
      )
    )
    
    // Cerrar el modal
    setEnrollmentModal(prev => ({ ...prev, open: false }))
    
    // Opcional: recargar los datos desde el servidor
    // fetchGroups()
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.teachers.some(teacher => 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

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

  const getActionButtonState = (group: ExtendedAPIGroupData) => {
    if (group.user_enrollment_status === 'pending') {
      return {
        disabled: true,
        label: "Inscripción Pendiente",
        variant: "outline" as const
      }
    }
    
    if (group.user_enrollment_status === 'active') {
      return {
        disabled: true,
        label: "Inscrito",
        variant: "outline" as const
      }
    }

    if (group.user_enrollment_status === 'completed') {
      return {
        disabled: true,
        label: "Completado",
        variant: "outline" as const
      }
    }

    return {
      disabled: false,
      label: "Inscribirse",
      variant: "default" as const
    }
  }

  return (
    <AcademicLayout title="Grupos disponibles">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            <div className="px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por grupo, curso o docente..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button variant="outline" className="sm:w-auto" disabled={loading}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>

              {meta && !loading && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Mostrando {meta.from} - {meta.to} de {meta.total} grupos disponibles
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

            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {!loading && !error && (
              <div className="px-4 lg:px-6">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "No se encontraron grupos que coincidan con tu búsqueda" 
                        : "No hay grupos disponibles en este momento"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredGroups.map((group) => {
                      const buttonState = getActionButtonState(group)
                      
                      return (
                        <GroupCard
                          key={group.id}
                          group={mapAPIGroupToGroupData(group)}
                          variant="available"
                          onAction={() => handleJoinClick(group)}
                          actionLabel={buttonState.label}
                          actionDisabled={buttonState.disabled}
                          actionVariant={buttonState.variant}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )}

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

      {/* Modal de inscripción - Solo se abre si no hay inscripción pendiente/activa */}
      <EnrollmentModal
        open={enrollmentModal.open}
        onOpenChange={(open) => {
          // Solo permitir cerrar el modal, no abrirlo si ya hay inscripción pendiente
          if (!open) {
            setEnrollmentModal(prev => ({ ...prev, open: false }))
          }
        }}
        groupId={enrollmentModal.groupId}
        groupName={enrollmentModal.groupName}
        courseName={enrollmentModal.courseName}
        token={token}
        onEnrollmentSuccess={handleEnrollmentSuccess}
      />
    </AcademicLayout>
  )
}