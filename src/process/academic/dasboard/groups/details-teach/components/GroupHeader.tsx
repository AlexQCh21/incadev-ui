import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Users } from "lucide-react"

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

interface GroupHeaderProps {
  groupData: {
    id: number
    name: string
    course_name: string
    course_description: string
    start_date: string
    end_date: string
    status: string
    students: Student[]
  }
  onBack: () => void
}

export function GroupHeader({ groupData, onBack }: GroupHeaderProps) {
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

  return (
    <div>
      <Button 
        onClick={onBack} 
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a mis grupos
      </Button>

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
  )
}