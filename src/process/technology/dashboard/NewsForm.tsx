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
import type { News, NewsCategory } from "@/types/developer-web"

interface NewsFormProps {
  news: News | null
  categories: NewsCategory[]
  onSuccess: () => void
  onCancel: () => void
}

export function NewsForm({ news, categories, onSuccess, onCancel }: NewsFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image: "",
    is_published: false,
    category_ids: [] as number[],
    meta_title: "",
    meta_description: "",
  })

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        content: news.content || "",
        excerpt: news.excerpt || "",
        featured_image: news.featured_image || "",
        is_published: news.is_published || false,
        category_ids: news.categories?.map(c => c.id) || [],
        meta_title: news.meta_title || "",
        meta_description: news.meta_description || "",
      })
    }
  }, [news])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (news) {
        await technologyApi.developerWeb.news.update(news.id, formData)
      } else {
        await technologyApi.developerWeb.news.create(formData)
      }
      onSuccess()
    } catch (error) {
      console.error("Error al guardar noticia:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }))
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

        <div className="space-y-2">
          <Label htmlFor="featured_image">Imagen destacada (URL)</Label>
          <Input
            id="featured_image"
            type="url"
            value={formData.featured_image}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label>Categorías</Label>
          <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`cat-${category.id}`}
                  checked={formData.category_ids.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor={`cat-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta título (SEO)</Label>
          <Input
            id="meta_title"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta descripción (SEO)</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="is_published">Estado de publicación</Label>
            <p className="text-sm text-muted-foreground">
              {formData.is_published ? "La noticia está publicada" : "La noticia está en borrador"}
            </p>
          </div>
          
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : news ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}