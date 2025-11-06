import AcademicLayout from "@/process/academic/AcademicLayout"
import { GroupCard, type GroupData } from "@/process/academic/dasboard/groups/components/GroupCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { useState } from "react"

export default function AvailableGroup() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // TODO: Reemplazar con endpoint real
  // const { data: groups, isLoading } = useQuery({
  //   queryKey: ['available-groups'],
  //   queryFn: () => fetch('/api/groups/available').then(res => res.json())
  // })
  
  const mockGroups: GroupData[] = [
    {
      id: "1",
      name: "Grupo A",
      course: "Aplicaciones en la nube",
      teacher: "Dr. Juan Pérez",
      image: "",
      schedule: "Lun-Mie 10:00-12:00",
      enrolled: 25,
      capacity: 30,
      startDate: "2025-03-01",
      status: "available"
    },
    {
      id: "2",
      name: "Grupo B",
      course: "Aplicaciones en la nube",
      teacher: "Dra. María González",
      image: "",
      schedule: "Mar-Jue 14:00-16:00",
      enrolled: 28,
      capacity: 30,
      startDate: "2025-03-01",
      status: "available"
    },
    {
      id: "3",
      name: "Grupo A",
      course: "Desarrollo Web Avanzado",
      teacher: "Ing. Carlos Ruiz",
      image: "",
      schedule: "Vie 16:00-20:00",
      enrolled: 15,
      capacity: 25,
      startDate: "2025-03-15",
      status: "available"
    }
  ]

  const handleJoinGroup = (groupId: string) => {
    // TODO: Implementar lógica de inscripción
    // fetch(`/api/groups/${groupId}/join`, { method: 'POST' })
    console.log("Inscribirse al grupo:", groupId)
  }

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AcademicLayout title="Grupos disponibles">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Barra de búsqueda y filtros */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por grupo, curso o docente..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Grid de grupos */}
            <div className="px-4 lg:px-6">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron grupos disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      variant="available"
                      onAction={handleJoinGroup}
                      actionLabel="Inscribirse"
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