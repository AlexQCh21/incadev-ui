import AcademicLayout from "@/process/academic/AcademicLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, BookOpen, Users, Loader2, AlertCircle, User } from "lucide-react"
import { useState, useEffect } from "react"
import { config } from "@/config/academic-config"
import { useAcademicAuth } from "@/process/academic/hooks/useAcademicAuth"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Teacher {
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

interface GroupDetailData {
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
  modules: Module[]
  created_at: string
}

interface APIDetailResponse {
  data: GroupDetailData
}

export default function DetailGroup() {
  const { token } = useAcademicAuth()
  const [groupData, setGroupData] = useState<GroupDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getGroupIdFromURL = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('id')
    }
    return null
  }

  useEffect(() => {
    const fetchGroupDetail = async () => {
      const groupId = getGroupIdFromURL()
      
      if (!groupId) {
        setError("No se proporcionó un ID de grupo válido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const tokenWithoutQuotes = token?.replace(/^"|"$/g, '')
        const endpoint = config.endpoints.groups.infoEnroll.replace(':group', groupId)
        
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

        const data: APIDetailResponse = await response.json()
        console.log("Detalle del grupo cargado:", data)
        setGroupData(data.data)
      } catch (error) {
        console.error("Error cargando detalle del grupo:", error)
        setError(error instanceof Error ? error.message : "Error desconocido al cargar el grupo")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchGroupDetail()
    }
  }, [token])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Activo</Badge>
      case "completed":
        return <Badge variant="secondary">Completado</Badge>
      case "enrolling":
        return <Badge variant="outline">Inscripción Abierta</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <AcademicLayout title="Cargando...">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando información del grupo...</p>
        </div>
      </AcademicLayout>
    )
  }

  if (error || !groupData) {
    return (
      <AcademicLayout title="Error">
        <div className="flex flex-1 flex-col">
          <div className="px-4 lg:px-6 py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "No se pudo cargar la información del grupo"}
              </AlertDescription>
            </Alert>
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
            
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{groupData.name}</CardTitle>
                        {getStatusBadge(groupData.status)}
                      </div>
                      <CardDescription className="text-base">
                        {groupData.course_name}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Versión: {groupData.course_version_name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupData.course_description && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {groupData.course_description}
                      </p>
                      <Separator />
                    </>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Inicio:</span>
                      <span className="font-medium">{formatDate(groupData.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="font-medium">{formatDate(groupData.end_date)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Docentes del grupo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupData.teachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={teacher.avatar || undefined} />
                          <AvatarFallback>
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{teacher.fullname}</p>
                          <p className="text-xs text-muted-foreground truncate">{teacher.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Módulos del curso ({groupData.modules.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {groupData.modules.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay módulos disponibles aún
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {groupData.modules.map((module) => (
                        <div key={module.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Módulo {module.sort}</Badge>
                                <h4 className="font-semibold">{module.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {module.description}
                              </p>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{module.classes.length} clases</span>
                                <span>{module.exams.length} exámenes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AcademicLayout>
  )
}