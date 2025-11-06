import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Calendar, User } from "lucide-react"

export interface GroupData {
  id: string
  name: string
  course: string
  teacher: string
  image: string
  schedule: string
  enrolled: number
  capacity: number
  startDate: string
  endDate?: string
  status?: "available" | "joined" | "completed" | "teaching"
  progress?: number
}

interface GroupCardProps {
  group: GroupData
  variant?: "available" | "joined" | "completed" | "teaching"
  onAction?: (groupId: string) => void
  actionLabel?: string
}

export function GroupCard({ group, variant = "available", onAction, actionLabel }: GroupCardProps) {
  const getStatusBadge = () => {
    switch (variant) {
      case "completed":
        return <Badge variant="secondary">Completado</Badge>
      case "joined":
        return <Badge variant="default">En curso</Badge>
      case "teaching":
        return <Badge variant="outline">Docente</Badge>
      default:
        return <Badge variant="outline">Disponible</Badge>
    }
  }

  const getActionButton = () => {
    if (!onAction || !actionLabel) return null
    
    return (
      <Button 
        onClick={() => onAction(group.id)}
        className="w-full"
        variant={variant === "available" ? "default" : "outline"}
      >
        {actionLabel}
      </Button>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-blue-500 to-purple-600">
        {group.image ? (
          <img 
            src={group.image} 
            alt={group.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg leading-tight">{group.name}</h3>
          <p className="text-sm text-muted-foreground">{group.course}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{group.teacher}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{group.schedule}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{group.enrolled} / {group.capacity} estudiantes</span>
        </div>

        {variant === "completed" && group.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{group.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${group.progress}%` }}
              />
            </div>
          </div>
        )}

        {variant === "joined" && group.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{group.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${group.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      {getActionButton() && (
        <CardFooter className="pt-3">
          {getActionButton()}
        </CardFooter>
      )}
    </Card>
  )
}