import AcademicLayout from "@/process/academic/AcademicLayout"
import { GroupCard, type GroupData } from "@/process/academic/dasboard/groups/components/GroupCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function FinishGroup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  
  // TODO: Reemplazar con endpoint real
  // const { data: groups, isLoading } = useQuery({
  //   queryKey: ['finished-groups'],
  //   queryFn: () => fetch('/api/groups/finished').then(res => res.json())
  // })
  
  const mockGroups: GroupData[] = [
    {
      id: "1",
      name: "Grupo A",
      course: "Aplicaciones en la nube",
      teacher: "Dr. Juan Pérez",
      image: "",
      schedule: "Lun-Mie 10:00-12:00",
      enrolled: 30,
      capacity: 30,
      startDate: "2024-08-01",
      endDate: "2024-12-15",
      status: "completed",
      progress: 100
    },
    {
      id: "2",
      name: "Grupo B",
      course: "Programación Orientada a Objetos",
      teacher: "Ing. María González",
      image: "",
      schedule: "Mar-Jue 14:00-16:00",
      enrolled: 28,
      capacity: 30,
      startDate: "2024-08-01",
      endDate: "2024-12-10",
      status: "completed",
      progress: 100
    },
    {
      id: "3",
      name: "Grupo A",
      course: "Estructuras de Datos",
      teacher: "Dr. Roberto Silva",
      image: "",
      schedule: "Vie 16:00-20:00",
      enrolled: 25,
      capacity: 25,
      startDate: "2024-03-01",
      endDate: "2024-07-20",
      status: "completed",
      progress: 100
    },
    {
      id: "4",
      name: "Grupo C",
      course: "Base de Datos I",
      teacher: "Dra. Ana Torres",
      image: "",
      schedule: "Lun-Vie 08:00-10:00",
      enrolled: 22,
      capacity: 25,
      startDate: "2024-03-01",
      endDate: "2024-07-15",
      status: "completed",
      progress: 100
    }
  ]

  const handleViewCertificate = (groupId: string) => {
    // TODO: Implementar descarga de certificado
    // window.open(`/api/groups/${groupId}/certificate`, '_blank')
    console.log("Ver certificado del grupo:", groupId)
  }

  const handleExportHistory = () => {
    // TODO: Implementar exportación de historial
    console.log("Exportar historial académico")
  }

  const filteredGroups = mockGroups
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

  return (
    <AcademicLayout title="Grupos completados">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Estadísticas */}
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">{mockGroups.length}</div>
                  <div className="text-sm text-muted-foreground">Grupos completados</div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">{new Set(mockGroups.map(g => g.course)).size}</div>
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

            {/* Barra de búsqueda y ordenamiento */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en historial..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>

            {/* Grid de grupos */}
            <div className="px-4 lg:px-6">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron grupos completados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      variant="completed"
                      onAction={handleViewCertificate}
                      actionLabel="Ver certificado"
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </AcademicLayout>
  )
}