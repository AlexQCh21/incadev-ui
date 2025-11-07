import AcademicLayout from "@/process/academic/AcademicLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  AlertCircle, 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react"
import { useState, useEffect } from "react"
import { config } from "@/config/academic-config"
import { useAcademicAuth } from "@/process/academic/hooks/useAcademicAuth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Teacher {
  id: number
  name: string
  fullname: string
  email: string
  avatar: string | null
}

interface Student {
  id: number
  name: string
  fullname: string
  email: string
  avatar: string | null
}

interface Module {
  id: number
  title: string
  description: string
  sort: number
  classes: any[]
  exams: any[]
}

interface GroupDetail {
  id: number
  name: string
  course_name: string
  course_version: string
  course_version_name: string
  course_description: string
  course_image: string | null
  start_date: string
  end_date: string
  status: string
  teachers: Teacher[]
  students: Student[]
  modules: Module[]
  created_at: string
}

interface CanCompleteData {
  can_complete: boolean
  reasons: {
    has_students: boolean
    has_classes: boolean
    has_exams: boolean
    total_students: number
    total_classes: number
    total_exams: number
  }
}

export default function DetailTeachGroup() {
  const { token } = useAcademicAuth()
  const [groupData, setGroupData] = useState<GroupDetail | null>(null)
  const [canCompleteData, setCanCompleteData] = useState<CanCompleteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completing, setCompleting] = useState(false)
    
  const getGroupIdFromURL = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('id')
    }
    return null
  }
    const groupId = getGroupIdFromURL()
  useEffect(() => {
    
    if (groupId && token) {
      loadGroupDetail()
      loadCanComplete()
    }
  }, [groupId, token])

  const loadGroupDetail = async () => {
    if (!token || !groupId) return

    try {
      setLoading(true)
      setError(null)
      const tokenWithoutQuotes = token.replace(/^"|"$/g, '')
      const endpoint = config.endpoints.groups.specificTeaching.replace(':group', groupId)
      
      const response = await fetch(
        `${config.apiUrl}${endpoint}`,
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

      const data = await response.json()
      console.log("Detalle del grupo cargado:", data)
      setGroupData(data.data)
    } catch (error) {
      console.error("Error cargando detalle del grupo:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const loadCanComplete = async () => {
    if (!token || !groupId) return

    try {
      const tokenWithoutQuotes = token.replace(/^"|"$/g, '')
      const endpoint = config.endpoints.groups.canComplete.replace(':group', groupId)
      
      const response = await fetch(
        `${config.apiUrl}${endpoint}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenWithoutQuotes}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error al verificar completitud`)
      }

      const data = await response.json()
      console.log("Verificación de completitud:", data)
      setCanCompleteData(data.data)
    } catch (error) {
      console.error("Error verificando completitud:", error)
    }
  }

  const handleCompleteGroup = async () => {
    if (!token || !groupId || !canCompleteData?.can_complete) return

    if (!confirm('¿Estás seguro de completar este grupo? Esta acción generará certificados y notas finales.')) {
      return
    }

    try {
      setCompleting(true)
      const tokenWithoutQuotes = token.replace(/^"|"$/g, '')
      const endpoint = config.endpoints.groups.complete.replace(':group', groupId)
      
      const response = await fetch(
        `${config.apiUrl}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokenWithoutQuotes}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error al completar el grupo`)
      }

      const data = await response.json()
      console.log("Grupo completado:", data)
      alert('Grupo completado exitosamente. Se han generado los certificados y notas finales.')
      loadGroupDetail()
      loadCanComplete()
    } catch (error) {
      console.error("Error completando grupo:", error)
      alert('Error al completar el grupo. Por favor, inténtalo de nuevo.')
    } finally {
      setCompleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Activo</Badge>
      case "enrolling":
        return <Badge variant="secondary">Matrícula Abierta</Badge>
      case "completed":
        return <Badge variant="outline">Completado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <AcademicLayout title="Detalle del grupo">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando información del grupo...</p>
          </div>
        </div>
      </AcademicLayout>
    )
  }

  if (error || !groupData) {
    return (
      <AcademicLayout title="Detalle del grupo">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center py-12 px-4">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || "No se pudo cargar la información del grupo"}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.history.back()} 
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </AcademicLayout>
    )
  }

  return (
    <AcademicLayout title={groupData.name}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Header con botón de volver */}
            <div className="px-4 lg:px-6">
              <Button 
                onClick={() => window.history.back()} 
                variant="ghost"
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a mis grupos
              </Button>

              {/* Información general */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{groupData.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {groupData.course_name}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        {groupData.course_description}
                      </p>
                    </div>
                    {getStatusBadge(groupData.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                        <p className="font-medium">{formatDate(groupData.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de fin</p>
                        <p className="font-medium">{formatDate(groupData.end_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estudiantes</p>
                        <p className="font-medium">{groupData.students.length}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estado de completitud */}
            {canCompleteData && groupData.status !== "completed" && (
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {canCompleteData.can_complete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      Estado de completitud
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {canCompleteData.reasons.has_students ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm">
                          Estudiantes: {canCompleteData.reasons.total_students}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canCompleteData.reasons.has_classes ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm">
                          Clases: {canCompleteData.reasons.total_classes}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canCompleteData.reasons.has_exams ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm">
                          Exámenes: {canCompleteData.reasons.total_exams}
                        </span>
                      </div>
                    </div>
                    
                    {canCompleteData.can_complete ? (
                      <Button 
                        onClick={handleCompleteGroup}
                        disabled={completing}
                        className="w-full md:w-auto"
                      >
                        {completing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Completando...
                          </>
                        ) : (
                          <>
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Completar grupo
                          </>
                        )}
                      </Button>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Este grupo no puede completarse aún. Asegúrate de tener al menos un estudiante, una clase y un examen calificados en cada módulo.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabs de información */}
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="modules">
                <TabsList>
                  <TabsTrigger value="modules">Módulos</TabsTrigger>
                  <TabsTrigger value="students">Estudiantes</TabsTrigger>
                  <TabsTrigger value="teachers">Docentes</TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="mt-4">
                  <div className="grid gap-4">
                    {groupData.modules.map((module) => (
                      <Card key={module.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                Módulo {module.sort}: {module.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {module.description}
                              </CardDescription>
                            </div>
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Clases: {module.classes.length}</span>
                            <span>Exámenes: {module.exams.length}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="students" className="mt-4">
                  {groupData.students.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No hay estudiantes inscritos en este grupo
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-3">
                      {groupData.students.map((student) => (
                        <Card key={student.id}>
                          <CardContent className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{student.fullname}</p>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="teachers" className="mt-4">
                  <div className="grid gap-3">
                    {groupData.teachers.map((teacher) => (
                      <Card key={teacher.id}>
                        <CardContent className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">{teacher.fullname}</p>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </div>
      </div>
    </AcademicLayout>
  )
}