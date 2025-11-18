import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { technologyApi } from "@/services/tecnologico/api"
import type { FAQ, FAQCategory } from "@/types/developer-web"

interface FAQFormProps {
  faq: FAQ | null
  categories: FAQCategory[]
  onSuccess: () => void
  onCancel: () => void
}

export function FAQForm({ faq, categories, onSuccess, onCancel }: FAQFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category_id: "",
    order: 0,
    is_published: false,
  })

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || "",
        answer: faq.answer || "",
        category_id: faq.category_id ? String(faq.category_id) : "",
        order: faq.order || 0,
        is_published: faq.is_published || false,
      })
    }
  }, [faq])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
      }

      if (faq) {
        await technologyApi.developerWeb.faqs.update(faq.id, dataToSend)
      } else {
        await technologyApi.developerWeb.faqs.create(dataToSend)
      }
      onSuccess()
    } catch (error) {
      console.error("Error al guardar FAQ:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Pregunta *</Label>
          <Input
            id="question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="¿Cuál es tu pregunta?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Respuesta *</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            rows={8}
            placeholder="Escribe la respuesta detallada aquí..."
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
            >
              <SelectTrigger id="category_id">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin categoría</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Orden de visualización</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) })
              }
              min="0"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Menor número = mayor prioridad
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_published">Estado de publicación</Label>
            <p className="text-sm text-muted-foreground">
              {formData.is_published ? "La FAQ está publicada" : "La FAQ está en borrador"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : faq ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}