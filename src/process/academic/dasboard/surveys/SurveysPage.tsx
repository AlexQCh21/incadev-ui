import AcademicLayout from "@/process/academic/AcademicLayout";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, CheckCircle2, Lock, Users, AlertCircle } from "lucide-react";
import { SurveyForm } from "@/process/academic/dasboard/surveys/components/SurveyForm";
import { useAcademicAuth } from "@/process/academic/hooks/useAcademicAuth";
import { config } from "@/config/academic-config";
import { config as evaluationConfig } from "@/config/evaluation-config"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Interfaces para los tipos de datos
interface SurveyQuestion {
  id: number;
  survey_id: number;
  question: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface SurveyMapping {
  id: number;
  event: string;
  survey_id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface APISurvey {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  questions: SurveyQuestion[];
  mapping: SurveyMapping;
}

interface APIGroupData {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  progress?: number;
}

interface GroupWithSurveys {
  group: APIGroupData;
  surveys: APISurvey[];
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    variant: "destructive" as const,
    icon: Clock,
    color: "text-red-600"
  },
  "in-progress": {
    label: "En progreso",
    variant: "default" as const,
    icon: ClipboardList,
    color: "text-blue-600"
  },
  completed: {
    label: "Completada",
    variant: "secondary" as const,
    icon: CheckCircle2,
    color: "text-green-600"
  }
};

export default function SurveysPage() {
  const { token } = useAcademicAuth();
  const [selectedSurvey, setSelectedSurvey] = useState<{survey: APISurvey, groupId: string} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupsWithSurveys, setGroupsWithSurveys] = useState<GroupWithSurveys[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener grupos matriculados
  const fetchEnrolledGroups = async (): Promise<APIGroupData[]> => {
    try {
      const tokenWithoutQuotes = token?.replace(/^"|"$/g, '');
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.groups.listComplete}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenWithoutQuotes}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error cargando grupos:", error);
      throw error;
    }
  };

  // Obtener encuestas disponibles
  const fetchSurveys = async (): Promise<APISurvey[]> => {
    try {
      const tokenWithoutQuotes = token?.replace(/^"|"$/g, '');
      const response = await fetch(
        `${evaluationConfig.apiUrl}${evaluationConfig.endpoints.surveys.byRole}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${tokenWithoutQuotes}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error cargando encuestas:", error);
      throw error;
    }
  };

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [groups, surveys] = await Promise.all([
          fetchEnrolledGroups(),
          fetchSurveys()
        ]);

        // Combinar grupos con sus encuestas (todas las encuestas aplican a todos los grupos)
        const groupsWithSurveysData: GroupWithSurveys[] = groups.map(group => ({
          group,
          surveys: surveys // Todas las encuestas están disponibles para cada grupo
        }));

        setGroupsWithSurveys(groupsWithSurveysData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError(error instanceof Error ? error.message : "Error desconocido al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token]);

  const handleSurveyClick = (survey: APISurvey, groupId: string) => {
    // Aquí podrías verificar si ya fue completada
    // Por ahora asumimos que todas están pendientes
    setSelectedSurvey({ survey, groupId });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSurvey(null);
  };

  const handleSurveySubmit = () => {
    // Actualizar el estado local para marcar como completada
    // En una implementación real, esto se haría basado en la respuesta del API
    handleCloseDialog();
  };

  // Calcular estadísticas
  const totalSurveys = groupsWithSurveys.reduce((total, groupData) => 
    total + groupData.surveys.length, 0
  );
  const pendingSurveys = totalSurveys; // Por simplicidad, todas están pendientes
  const completedSurveys = 0; // Podrías implementar lógica para trackear completadas

  if (loading) {
    return (
      <AcademicLayout title="Módulo de encuestas">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout title="Módulo de encuestas">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Encuestas Disponibles</h2>
              <p className="text-muted-foreground">
                Completa las encuestas pendientes para ayudarnos a mejorar tu experiencia académica
              </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {pendingSurveys}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    En Progreso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    0
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {completedSurveys}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Groups with Surveys */}
            <div className="space-y-6">
              {groupsWithSurveys.map((groupData) => (
                <div key={groupData.group.id} className="space-y-4">
                  {/* Group Header */}
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">{groupData.group.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {groupData.group.description}
                      </p>
                    </div>
                  </div>

                  {/* Surveys Grid */}
                  <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {groupData.surveys.map((survey) => {
                      const surveyStatus = "pending"; // Por defecto pendiente
                      const config = statusConfig[surveyStatus];
                      const StatusIcon = config.icon;

                      return (
                        <Card
                          key={`${groupData.group.id}-${survey.id}`}
                          className="relative overflow-hidden transition-all hover:shadow-md cursor-pointer hover:border-primary"
                          onClick={() => handleSurveyClick(survey, groupData.group.id)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">{survey.title}</CardTitle>
                                <Badge variant={config.variant} className="mb-3">
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {survey.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {survey.questions.length} preguntas
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-xs capitalize">
                                  Tipo: {survey.mapping.event}
                                </span>
                                <Button size="sm" variant="default">
                                  Iniciar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Survey Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.survey.title}</DialogTitle>
            <DialogDescription>{selectedSurvey?.survey.description}</DialogDescription>
          </DialogHeader>
          {selectedSurvey && (
            <SurveyForm 
              survey={selectedSurvey.survey}
              groupId={selectedSurvey.groupId}
              onClose={handleCloseDialog}
              onSubmit={handleSurveySubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </AcademicLayout>
  );
}