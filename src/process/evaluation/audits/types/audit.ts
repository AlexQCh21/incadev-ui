// ===============================================
// TYPES FOR AUDITS MODULE (AUDITOR + AUDIT_MANAGER)
// ===============================================

// Roles válidos del módulo de Auditorías
export type AuditRoles = "audit_manager" | "auditor"

// Estado de una auditoría
export type AuditStatus =
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"

// Estado de un hallazgo
export type FindingStatus =
    | "open"
    | "in_progress"
    | "resolved"
    | "closed"

// Severidad de hallazgos
export type FindingSeverity =
    | "low"
    | "medium"
    | "high"
    | "critical"

// Estado de una acción correctiva
export type ActionStatus =
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"

// ================================
// MODELOS PRINCIPALES
// ================================

// Modelo: Auditoría
export interface Audit {
    id: number
    auditor_id: number
    audit_date: string
    summary: string
    recommendation: string | null
    path_report: string | null
    status: AuditStatus
    auditable_type: string
    auditable_id: number
    created_at: string
    updated_at: string

    // Campos adicionales para UI
    title?: string // Para compatibilidad con tu interfaz existente
    description?: string // Para compatibilidad con tu interfaz existente
    assigned_auditor_id?: number | null // Para compatibilidad
}

// Modelo: Hallazgo
export interface Finding {
    id: number
    audit_id: number
    description: string
    severity: FindingSeverity
    status: FindingStatus
    created_at: string
    updated_at: string

    // Campos adicionales para compatibilidad
    title?: string // Para compatibilidad con tu interfaz existente
}

// Modelo: Evidencia
export interface Evidence {
    id: number
    finding_id: number
    file_url: string
    file_name?: string
    file_size?: number
    mime_type?: string
    created_at: string
    updated_at?: string
}

// Modelo: Acción Correctiva
export interface ActionItem {
    id: number
    finding_id: number
    responsible_id: number
    action_required: string
    due_date: string
    status: ActionStatus
    created_at: string
    updated_at: string

    // Campos adicionales para compatibilidad
    action?: string // Para compatibilidad con tu interfaz existente
}

// ================================
// FORM DATA
// ================================

export interface AuditFormData {
    audit_date: string
    summary: string
    auditable_type: string
    auditable_id: number

    // Campos adicionales para compatibilidad
    title?: string
    description?: string
}

export interface RecommendationFormData {
    recommendation: string
}

export interface FindingFormData {
    description: string
    severity: FindingSeverity

    // Campos adicionales para compatibilidad
    title?: string
}

export interface FindingStatusFormData {
    status: FindingStatus
}

export interface ActionFormData {
    responsible_id: number
    action_required: string
    due_date: string

    // Campos adicionales para compatibilidad
    action?: string
}

export interface ActionStatusFormData {
    status: ActionStatus
}

// ================================
// PAGINACIÓN
// ================================

export interface PaginationMeta {
    current_page: number
    from: number
    to: number
    per_page: number
    total: number
    last_page: number
}

export interface PaginationLinks {
    first: string
    last: string
    prev: string | null
    next: string | null
}

// ================================
// RESPUESTAS DEL BACKEND
// ================================

export interface ApiResponse<T> {
    success?: boolean
    message?: string
    data: T
    meta?: PaginationMeta
    links?: PaginationLinks
}

export interface ListResponse<T> {
    data: T[]
    meta: PaginationMeta
    links: PaginationLinks
}

// Tipos específicos de respuesta
export type AuditListResponse = ListResponse<Audit>
export type AuditResponse = ApiResponse<Audit>
export type FindingListResponse = ListResponse<Finding>
export type FindingResponse = ApiResponse<Finding>
export type ActionListResponse = ListResponse<ActionItem>
export type ActionResponse = ApiResponse<ActionItem>
export type EvidenceResponse = ApiResponse<Evidence>

// ================================
// DASHBOARD STATISTICS
// ================================

export interface AuditDashboardStats {
    total_audits: number
    completed_audits: number
    pending_audits: number
    in_progress_audits: number
    findings_total: number
    actions_total: number
    audits_over_time: {

    }

    // Campos adicionales basados en tus endpoints
    critical_findings?: number
    high_findings?: number
    medium_findings?: number
    low_findings?: number
}

export type AuditDashboardResponse = ApiResponse<AuditDashboardStats>

// ================================
// REPORTES
// ================================

export interface ReportGenerationResponse {
    message: string
    report_url?: string
    success: boolean
}

export interface DownloadResponse {
    blob: Blob
    filename: string
}

// ================================
// FILTROS Y BÚSQUEDAS
// ================================

export interface AuditFilters {
    search?: string
    status?: AuditStatus | 'all'
    date_from?: string
    date_to?: string
    auditor_id?: number
    severity?: FindingSeverity
}

// ================================
// CONSTANTES PARA SELECTS
// ================================

export const AUDIT_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
] as const

export const FINDING_STATUS_OPTIONS = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' }
] as const

export const FINDING_SEVERITY_OPTIONS = [
    { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
] as const

export const ACTION_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
] as const

// ================================
// UTILITY TYPES
// ================================

export type TableAction = 'view' | 'edit' | 'delete' | 'findings' | 'report' | 'recommendation'
export type DialogMode = 'create' | 'edit' | 'view'
month: string
count: number
    }>
}

export interface AuditDashboardStats {
    // Para compatibilidad con componentes existentes
    total_audits: number
    completed_audits: number
    pending_audits: number
    in_progress_audits: number
    findings_total: number
    actions_total: number
    critical_findings?: number
    high_findings?: number
    medium_findings?: number
    low_findings?: number
    audits_over_time: Array<{
        date: string
        count: number
    }>

    // Datos completos del dashboard
    dashboard_data?: DashboardStatsData
}

export interface AuditDashboardResponse {
    success: boolean
    message: string
    data: DashboardStatsData
}

// ================================
// REPORTES
// ================================

export interface ReportGenerationResponse {
    message: string
    report_url?: string
    success: boolean
}

// ================================
// FILTROS Y BÚSQUEDAS
// ================================

export interface AuditFilters {
    search?: string
    status?: AuditStatus | 'all'
    date_from?: string
    date_to?: string
    auditor_id?: number
    severity?: FindingSeverity
}

// ================================
// CONSTANTES PARA SELECTS
// ================================

export const AUDIT_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completada', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelada', color: 'bg-red-100 text-red-800' }
] as const

export const FINDING_STATUS_OPTIONS = [
    { value: 'open', label: 'Abierto', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Resuelto', color: 'bg-green-100 text-green-800' },
    { value: 'closed', label: 'Cerrado', color: 'bg-gray-100 text-gray-800' }
] as const

export const FINDING_SEVERITY_OPTIONS = [
    { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
] as const

export const ACTION_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completada', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelada', color: 'bg-red-100 text-red-800' }
] as const

// ================================
// UTILITY TYPES
// ================================

export type TableAction = 'view' | 'edit' | 'delete' | 'findings' | 'report' | 'recommendation'
export type DialogMode = 'create' | 'edit' | 'view'

// ================================
// USER TYPES
// ================================

export interface AuditUser {
    id: number
    name: string
    email: string
    role: AuditRoles
}