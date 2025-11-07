import AcademicLayout from "@/process/academic/AcademicLayout";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, CheckCircle2, Lock } from "lucide-react";
import { SurveyForm } from "@/process/academic/dasboard/surveys/components/SurveyForm";

// Datos de prueba
const surveys = [
  {
    id: "survey-1",
    title: "Encuesta de Satisfacción del Curso",
    description: "Ayúdanos a mejorar la calidad de nuestros cursos compartiendo tu experiencia",
    status: "pending",
    deadline: "2025-11-15",
    estimatedTime: "5 min",
    dataFile: "survey-satisfaction.json"
  },
  {
    id: "survey-2",
    title: "Evaluación Docente",
    description: "Evalúa el desempeño de tus docentes en este periodo académico",
    status: "in-progress",
    deadline: "2025-11-20",
    estimatedTime: "8 min",
    dataFile: "survey-teacher-evaluation.json"
  },
  {
    id: "survey-3",
    title: "Encuesta de Infraestructura TI",
    description: "Valoración de servicios tecnológicos y laboratorios de cómputo",
    status: "completed",
    deadline: "2025-10-30",
    estimatedTime: "6 min",
    dataFile: "survey-infrastructure.json"
  }
];

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
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSurveyClick = (surveyId: string, status: string) => {
    if (status === "completed") return;
    setSelectedSurvey(surveyId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSurvey(null);
  };

  const currentSurvey = surveys.find(s => s.id === selectedSurvey);

  return (
    <AcademicLayout title="Módulo de encuestas">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Encuestas Disponibles</h2>
              <p className="text-muted-foreground">
                Completa las encuestas pendientes para ayudarnos a mejorar tu experiencia académica
              </p>
            </div>

            {/* Surveys Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {surveys.map((survey) => {
                const config = statusConfig[survey.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                const isCompleted = survey.status === "completed";

                return (
                  <Card
                    key={survey.id}
                    className={`relative overflow-hidden transition-all hover:shadow-md ${
                      isCompleted 
                        ? "opacity-60 cursor-not-allowed" 
                        : "cursor-pointer hover:border-primary"
                    }`}
                    onClick={() => handleSurveyClick(survey.id, survey.status)}
                  >
                    {isCompleted && (
                      <div className="absolute top-3 right-3">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    
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
                            Tiempo estimado: {survey.estimatedTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs">
                            Fecha límite: {new Date(survey.deadline).toLocaleDateString('es-ES')}
                          </span>
                          {!isCompleted && (
                            <Button 
                              size="sm" 
                              variant={survey.status === "pending" ? "default" : "outline"}
                            >
                              {survey.status === "pending" ? "Iniciar" : "Continuar"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {surveys.filter(s => s.status === "pending").length}
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
                    {surveys.filter(s => s.status === "in-progress").length}
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
                    {surveys.filter(s => s.status === "completed").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentSurvey?.title}</DialogTitle>
            <DialogDescription>{currentSurvey?.description}</DialogDescription>
          </DialogHeader>
          {currentSurvey && (
            <SurveyForm 
              surveyId={currentSurvey.id}
              dataFile={currentSurvey.dataFile}
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </AcademicLayout>
  );
}