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
import type { Alert, AlertType, AlertSeverity } from "@/types/developer-web"

interface AlertFormProps {
  alert: Alert | null
  onSuccess: () => void
  onCancel: () => void
}

export function AlertForm({ alert, onSuccess, onCancel }: AlertFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as AlertType,
    severity: "medium" as AlertSeverity,
    is_published: false,
    dismissible: true,
    action_url: "",
    action_text: "",
    expiration_date: "",
  })

  useEffect(() => {
    if (alert) {
      setFormData({
        title: alert.title || "",
        content: alert.content || "",
        type: alert.type || "info",
        severity: alert.severity || "medium",
        is_published: alert.is_published || false,
        dismissible: alert.dismissible ?? true,
        action_url: alert.action_url || "",
        action_text: alert.action_text || "",
        expiration_date: alert.expiration_date || "",
      })
    }
  }, [alert])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (alert) {
        await technologyApi.developerWeb.alerts.update(alert.id, formData)
      } else {
        await technologyApi.developerWeb.alerts.create(formData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error al guardar alerta:", error)
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
          <Label htmlFor="content">Contenido *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: AlertType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Información</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Éxito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severidad *</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: AlertSeverity) =>
                setFormData({ ...formData, severity: value })
              }
            >
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="action_text">Texto del botón de acción</Label>
            <Input
              id="action_text"
              value={formData.action_text}
              onChange={(e) =>
                setFormData({ ...formData, action_text: e.target.value })
              }
              placeholder="Ver más"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_url">URL de acción</Label>
            <Input
              id="action_url"
              type="url"
              value={formData.action_url}
              onChange={(e) =>
                setFormData({ ...formData, action_url: e.target.value })
              }
              placeholder="https://ejemplo.com"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="dismissible">Alerta descartable</Label>
            <p className="text-sm text-muted-foreground">
              Los usuarios pueden cerrar esta alerta
            </p>
          </div>

        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_published">Estado de publicación</Label>
            <p className="text-sm text-muted-foreground">
              {formData.is_published ? "La alerta está publicada" : "La alerta está en borrador"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : alert ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}