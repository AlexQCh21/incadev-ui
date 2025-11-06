import AcademicLayout from "@/process/academic/AcademicLayout"
import { GroupCard, type GroupData } from "@/process/academic/dasboard/groups/components/GroupCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, BookOpen, GraduationCap } from "lucide-react"
import { useState } from "react"

export default function TeachGroup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  
  // TODO: Reemplazar con endpoint real
  // const { data: groups, isLoading } = useQuery({
  //   queryKey: ['teaching-groups'],
  //   queryFn: () => fetch('/api/groups/teaching').then(res => res.json())
  // })
  
  const mockGroups: GroupData[] = [
    {
      id: "1",
      name: "Grupo A",
      course: "Aplicaciones en la nube",
      teacher: "Tú",
      image: "",
      schedule: "Lun-Mie 10:00-12:00",
      enrolled: 28,
      capacity: 30,
      startDate: "2025-02-01",
      status: "teaching",
      progress: 60
    },
    {
      id: "2",
      name: "Grupo B",
      course: "Aplicaciones en la nube",
      teacher: "Tú",
      image: "",
      schedule: "Mar-Jue 14:00-16:00",
      enrolled: 25,
      capacity: 30,
      startDate: "2025-02-01",
      status: "teaching",
      progress: 55
    },
    {
      id: "3",
      name: "Grupo A",
      course: "Desarrollo Web Avanzado",
      teacher: "Tú",
      image: "",
      schedule: "Vie 16:00-20:00",
      enrolled: 22,
      capacity: 25,
      startDate: "2025-03-01",
      status: "teaching",
      progress: 30
    }
  ]

  const archivedGroups: GroupData[] = [
    {
      id: "4",
      name: "Grupo A",
      course: "Aplicaciones en la nube",
      teacher: "Tú",
      image: "",
      schedule: "Lun-Mie 10:00-12:00",
      enrolled: 30,
      capacity: 30,
      startDate: "2024-08-01",
      endDate: "2024-12-15",
      status: "teaching",
      progress: 100
    },
    {
      id: "5",
      name: "Grupo B",
      course: "Programación Web",
      teacher: "Tú",
      image: "",
      schedule: "Mar-Jue 14:00-16:00",
      enrolled: 28,
      capacity: 30,
      startDate: "2024-08-01",
      endDate: "2024-12-10",
      status: "teaching",
      progress: 100
    }
  ]

  const handleManageGroup = (groupId: string) => {
    // TODO: Navegar a la vista de gestión del grupo
    // router.push(`/groups/${groupId}/manage`)
    console.log("Gestionar grupo:", groupId)
  }

  const handleCreateGroup = () => {
    // TODO: Abrir modal o navegar a formulario de creación
    console.log("Crear nuevo grupo")
  }

  const allGroups = activeTab === "active" ? mockGroups : archivedGroups
  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.course.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStudents = mockGroups.reduce((acc, g) => acc + g.enrolled, 0)
  const averageProgress = Math.round(
    mockGroups.reduce((acc, g) => acc + (g.progress || 0), 0) / mockGroups.length
  )

  return (
    <AcademicLayout title="Grupos que dicto">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Estadísticas del docente */}
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{mockGroups.length}</div>
                      <div className="text-sm text-muted-foreground">Grupos activos</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalStudents}</div>
                      <div className="text-sm text-muted-foreground">Estudiantes totales</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{averageProgress}%</div>
                      <div className="text-sm text-muted-foreground">Progreso promedio</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border rounded-lg p-4 flex items-center">
                  <Button onClick={handleCreateGroup} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear grupo
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs y búsqueda */}
            <div className="px-4 lg:px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="active">Activos</TabsTrigger>
                    <TabsTrigger value="archived">Archivados</TabsTrigger>
                  </TabsList>

                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar grupos..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredGroups.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {activeTab === "active" 
                          ? "No tienes grupos activos" 
                          : "No tienes grupos archivados"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredGroups.map((group) => (
                        <GroupCard
                          key={group.id}
                          group={group}
                          variant="teaching"
                          onAction={handleManageGroup}
                          actionLabel="Gestionar"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </div>
      </div>
    </AcademicLayout>
  )
}