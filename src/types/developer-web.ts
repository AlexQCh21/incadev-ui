// Developer Web Module Types

// ============================================
// Enums y Types
// ============================================

export type ContentStatus = "published" | "draft" | "scheduled"
export type AnnouncementImportance = "low" | "medium" | "high"
export type AlertType = "info" | "warning" | "error" | "success"
export type AlertSeverity = "low" | "medium" | "high" | "critical"

// ============================================
// Interfaces - Base
// ============================================

export interface BaseContent {
  id: number
  title: string
  content: string
  is_published: boolean
  views_count: number
  created_at: string
  updated_at: string
  published_at?: string
  author_id?: number
  author?: {
    id: number
    name: string
    email: string
  }
}

export interface ContentStats {
  total: number
  published: number
  draft: number
  total_views: number
  average_views: number
}

// ============================================
// Interfaces - News
// ============================================

export interface News extends BaseContent {
  excerpt?: string
  featured_image?: string
  categories: NewsCategory[]
  meta_title?: string
  meta_description?: string
  slug: string
}

export interface NewsCategory {
  id: number
  name: string
  slug: string
  description?: string
  news_count?: number
}

export interface NewsStats extends ContentStats {
  by_category: Array<{
    category_id: number
    category_name: string
    count: number
    views: number
  }>
  recent_published: News[]
}

// ============================================
// Interfaces - Announcements
// ============================================

export interface Announcement extends BaseContent {
  excerpt?: string
  importance: AnnouncementImportance
  expiration_date?: string
  is_sticky: boolean
}

export interface AnnouncementStats extends ContentStats {
  by_importance: {
    low: number
    medium: number
    high: number
  }
  expired: number
  sticky: number
  active_sticky: number
}

// ============================================
// Interfaces - Alerts
// ============================================

export interface Alert extends BaseContent {
  type: AlertType
  severity: AlertSeverity
  action_url?: string
  action_text?: string
  dismissible: boolean
  expiration_date?: string
  is_active: boolean
}

export interface AlertStats extends ContentStats {
  by_type: {
    info: number
    warning: number
    error: number
    success: number
  }
  by_severity: {
    low: number
    medium: number
    high: number
    critical: number
  }
  active: number
  expired: number
}

// ============================================
// Interfaces - FAQs
// ============================================

export interface FAQ {
  id: number
  question: string
  answer: string
  category_id: number
  category?: FAQCategory
  order: number
  is_published: boolean
  views_count: number
  helpful_count: number
  not_helpful_count: number
  created_at: string
  updated_at: string
}

export interface FAQCategory {
  id: number
  name: string
  description?: string
  order: number
  faqs_count?: number
}

export interface FAQStats extends ContentStats {
  by_category: Array<{
    category_id: number
    category_name: string
    count: number
    views: number
  }>
  total_helpful: number
  total_not_helpful: number
  helpful_rate: number
}

// ============================================
// Interfaces - Dashboard
// ============================================

export interface WebDashboardData {
  stats: {
    news: NewsStats
    announcements: AnnouncementStats
    alerts: AlertStats
    faqs: FAQStats
  }
  recent_activity: {
    news: News[]
    announcements: Announcement[]
    alerts: Alert[]
    faqs: FAQ[]
  }
  alerts: {
    expiring_announcements: Announcement[]
    expiring_alerts: Alert[]
    low_views_content: Array<News | Announcement>
  }
}

// ============================================
// Labels para UI
// ============================================

export const AnnouncementImportanceLabels: Record<AnnouncementImportance, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

export const AlertTypeLabels: Record<AlertType, string> = {
  info: "Información",
  warning: "Advertencia",
  error: "Error",
  success: "Éxito",
}

export const AlertSeverityLabels: Record<AlertSeverity, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica",
}

export const ContentStatusLabels: Record<ContentStatus, string> = {
  published: "Publicado",
  draft: "Borrador",
  scheduled: "Programado",
}

// ============================================
// Colores para badges (usando shadcn/ui colors)
// ============================================

export const AnnouncementImportanceColors: Record<AnnouncementImportance, string> = {
  low: "bg-gray-500/10 text-gray-600 dark:text-gray-500 border-gray-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  high: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20",
}

export const AlertTypeColors: Record<AlertType, string> = {
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20",
  warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  error: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20",
  success: "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20",
}

export const AlertSeverityColors: Record<AlertSeverity, string> = {
  low: "bg-gray-500/10 text-gray-600 dark:text-gray-500 border-gray-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20",
  critical: "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20",
}

export const ContentStatusColors: Record<ContentStatus, string> = {
  published: "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20",
  draft: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20",
}

// ============================================
// Iconos sugeridos (para uso con Lucide o Tabler)
// ============================================

export const ContentTypeIcons: Record<string, string> = {
  news: "Newspaper",
  announcements: "Megaphone",
  alerts: "AlertTriangle",
  faqs: "MessageCircle",
}