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
import type { Announcement, AnnouncementImportance } from "@/types/developer-web"

interface AnnouncementFormProps {
  announcement: Announcement | null
  onSuccess: () => void
  onCancel: () => void
}

export function AnnouncementForm({ announcement, onSuccess, onCancel }: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    importance: "medium" as AnnouncementImportance,
    is_published: false,
    is_sticky: false,
    expiration_date: "",
  })

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
        excerpt: announcement.excerpt || "",
        importance: announcement.importance || "medium",
        is_published: announcement.is_published || false,
        is_sticky: announcement.is_sticky || false,
        expiration_date: announcement.expiration_date || "",
      })
    }
  }, [announcement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (announcement) {
        await technologyApi.developerWeb.announcements.update(announcement.id, formData)
      } else {
        await technologyApi.developerWeb.announcements.create(formData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error al guardar anuncio:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Extracto</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenido *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="importance">Importancia *</Label>
            <Select
              value={formData.importance}
              onValueChange={(value: AnnouncementImportance) =>
                setFormData({ ...formData, importance: value })
              }
            >
              <SelectTrigger id="importance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration_date">Fecha de expiración</Label>
            <Input
              id="expiration_date"
              type="date"
              value={formData.expiration_date}
              onChange={(e) =>
                setFormData({ ...formData, expiration_date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_published">Estado de publicación</Label>
            <p className="text-sm text-muted-foreground">
              {formData.is_published ? "El anuncio está publicado" : "El anuncio está en borrador"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_sticky">Anuncio fijado</Label>
            <p className="text-sm text-muted-foreground">
              Los anuncios fijados aparecen siempre en la parte superior
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : announcement ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}