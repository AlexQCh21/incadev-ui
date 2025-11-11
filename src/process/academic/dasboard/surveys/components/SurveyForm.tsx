import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import satisfactionData from "@/process/academic/dasboard/surveys/data/survey-satisfaction.json";
import teacherEvaluationData from "@/process/academic/dasboard/surveys/data/survey-teacher-evaluation.json";
import infrastructureData from "@/process/academic/dasboard/surveys/data/survey-infrastructure.json";

interface SurveyFormProps {
  surveyId: string;
  dataFile: string;
  onClose: () => void;
}

const surveyDataMap: Record<string, any> = {
  "survey-satisfaction.json": satisfactionData,
  "survey-teacher-evaluation.json": teacherEvaluationData,
  "survey-infrastructure.json": infrastructureData
};

export function SurveyForm({ surveyId, dataFile, onClose }: SurveyFormProps) {
  const surveyData = surveyDataMap[dataFile];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const totalQuestions = surveyData.questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Encuesta incompleta",
        description: `Por favor responde todas las preguntas. Te faltan ${totalQuestions - answeredQuestions} pregunta(s).`,
        variant: "destructive"
      });
      return;
    }

    // Aquí puedes enviar los datos al backend
    console.log("Survey submitted:", { surveyId, answers });
    
    toast({
      title: "¡Encuesta enviada!",
      description: "Gracias por tu tiempo. Tus respuestas han sido registradas exitosamente.",
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso de la encuesta</span>
          <span className="font-medium">{answeredQuestions}/{totalQuestions} preguntas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {surveyData.questions.map((question: any, index: number) => (
          <div key={question.id} className="space-y-3 p-4 rounded-lg border bg-card">
            <Label className="text-base font-medium">
              {index + 1}. {question.text}
              {question.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {question.type === "rating" && (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option: any) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label 
                        htmlFor={`${question.id}-${option.value}`}
                        className="cursor-pointer font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "multiple-choice" && (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="space-y-2">
                  {question.options.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label 
                        htmlFor={`${question.id}-${option}`}
                        className="cursor-pointer font-normal"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "text" && (
              <Textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="min-h-[100px]"
              />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Enviar Encuesta
        </Button>
      </div>
    </form>
  );
}