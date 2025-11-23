// src/process/evaluation/surveys/components/SurveyFormDialog.tsx

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Survey, SurveyFormData } from "@/process/evaluation/surveys/types/survey"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  survey?: Survey | null
  onSubmit: (data: SurveyFormData) => Promise<boolean>
}

const defaultForm: SurveyFormData = {
  title: "",
  description: "",
}

export function SurveyFormDialog({ open, onOpenChange, survey, onSubmit }: Props) {
  const [form, setForm] = useState<SurveyFormData>(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (survey) {
      setForm({ title: survey.title, description: survey.description})
    } else {
      setForm(defaultForm)
    }
  }, [survey, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await onSubmit(form)
    setSubmitting(false)
    if (ok) onOpenChange(false)
  }

  const isEdit = !!survey

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar Encuesta" : "Nueva Encuesta"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Modifica los datos de la encuesta" : "Completa los campos para crear una nueva encuesta"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Encuesta de satisfacción"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe el propósito de la encuesta..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}