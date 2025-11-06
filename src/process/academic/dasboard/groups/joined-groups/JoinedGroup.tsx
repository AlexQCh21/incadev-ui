import AcademicLayout from "@/process/academic/AcademicLayout"
import { GroupCard, type GroupData } from "@/process/academic/dasboard/groups/components/GroupCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function JoinedGroup() {
  const [activeTab, setActiveTab] = useState("all")
  
  // TODO: Reemplazar con endpoint real
  // const { data: groups, isLoading } = useQuery({
  //   queryKey: ['joined-groups'],
  //   queryFn: () => fetch('/api/groups/joined').then(res => res.json())
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
      startDate: "2025-02-01",
      status: "joined",
      progress: 65
    },
    {
      id: "2",
      name: "Grupo B",
      course: "Desarrollo Web Avanzado",
      teacher: "Ing. Carlos Ruiz",
      image: "",
      schedule: "Mar-Jue 14:00-16:00",
      enrolled: 28,
      capacity: 30,
      startDate: "2025-01-15",
      status: "joined",
      progress: 45
    },
    {
      id: "3",
      name: "Grupo A",
      course: "Base de Datos II",
      teacher: "Dra. Ana Torres",
      image: "",
      schedule: "Vie 16:00-20:00",
      enrolled: 20,
      capacity: 25,
      startDate: "2025-03-01",
      status: "joined",
      progress: 20
    }
  ]

  const handleViewGroup = (groupId: string) => {
    // TODO: Navegar a la vista detallada del grupo
    // router.push(`/groups/${groupId}`)
    console.log("Ver detalles del grupo:", groupId)
  }

  const filteredGroups = mockGroups.filter(group => {
    if (activeTab === "all") return true
    if (activeTab === "active") return group.progress! < 100
    if (activeTab === "low-progress") return group.progress! < 50
    return true
  })

  return (
    <AcademicLayout title="Grupos a los que te has unido">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Tabs para filtrar por estado */}
            <div className="px-4 lg:px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Activos</TabsTrigger>
                  <TabsTrigger value="low-progress">Bajo progreso</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredGroups.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No tienes grupos en esta categoría</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredGroups.map((group) => (
                        <GroupCard
                          key={group.id}
                          group={group}
                          variant="joined"
                          onAction={handleViewGroup}
                          actionLabel="Ver grupo"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Resumen de progreso */}
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">{mockGroups.length}</div>
                  <div className="text-sm text-muted-foreground">Grupos totales</div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {Math.round(mockGroups.reduce((acc, g) => acc + (g.progress || 0), 0) / mockGroups.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progreso promedio</div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <div className="text-2xl font-bold">
                    {mockGroups.filter(g => (g.progress || 0) < 50).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Requieren atención</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AcademicLayout>
  )
}