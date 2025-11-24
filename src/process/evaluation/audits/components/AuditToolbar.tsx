// components/AuditToolbar.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RefreshCw, Search, Plus } from "lucide-react"

interface AuditToolbarProps {
    search: string
    onSearchChange: (value: string) => void
    statusFilter: string
    onStatusFilterChange: (value: string) => void
    onRefresh: () => void
    onCreate: () => void
    loading?: boolean
    canCreate?: boolean
}

export function AuditToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onRefresh,
    onCreate,
    loading = false,
    canCreate = false
}: AuditToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar auditorías..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8"
                    />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="in_progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completadas</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
                {/* Refresh Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                </Button>

                {/* Create Button - Solo para audit_manager */}
                {canCreate && (
                    <Button size="sm" onClick={onCreate} disabled={loading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Auditoría
                    </Button>
                )}
            </div>
        </div>
    )
}