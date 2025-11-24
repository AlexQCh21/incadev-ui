// components/AuditFormDialog.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { auditService } from "@/process/evaluation/audits/services/audit-service"

interface AuditFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    audit?: any
    onSuccess: () => void
}

export function AuditFormDialog({
    open,
    onOpenChange,
    audit,
    onSuccess
}: AuditFormDialogProps) {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 👇 CORREGIDO: Estructura simplificada según tu API
    const [formData, setFormData] = useState({
        audit_date: "",
            summary: "",
            auditable_type: "",
            auditable_id: "",
        }
    })

    useEffect(() => {
        if (open) {
            loadAuditables()
            if (audit) {
                form.reset({
                    summary: audit.summary,
                    auditable_type: audit.auditable_type,
                    auditable_id: audit.auditable_id.toString(),
                    audit_date: new Date(audit.audit_date),
                })
            } else {
                form.reset({
                    summary: "",
                    auditable_type: "",
                    auditable_id: "",
                    audit_date: new Date(),
                })
            }
        }
    }, [open, audit])

    const loadAuditables = async () => {
        try {
            // Cargar tipos de elementos auditables
            const typesResponse = await auditService.getAuditableTypes()
            if (typesResponse.success) {
                // Aquí podrías cargar los elementos según el tipo seleccionado
                // Por simplicidad, asumimos que ya tenemos los datos
            }
        } catch (error) {
            console.error("Error cargando datos:", error)
        }
    }

    const handleSubmit = async (data: z.infer<typeof auditFormSchema>) => {
        setLoading(true)
        try {
            const formData: AuditFormData = {
                ...data,
                audit_date: format(data.audit_date, 'yyyy-MM-dd'),
                auditable_id: parseInt(data.auditable_id),
                auditor_id: 1, // Esto debería venir del usuario autenticado
            }

            const success = await onSubmit(formData)
            if (success) {
                onOpenChange(false)
                form.reset()
            }
        } catch (error) {
            console.error("Error enviando formulario:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Crear Nueva Auditoría
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {/* Fecha de Auditoría */}
                        <FormField
                            control={form.control}
                            name="audit_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Auditoría</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Selecciona una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tipo de Elemento */}
                        <FormField
                            control={form.control}
                            name="auditable_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Elemento</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="IncadevUns\\CoreDomain\\Models\\Unidad">Unidad</SelectItem>
                                            <SelectItem value="IncadevUns\\CoreDomain\\Models\\Sistema">Sistema</SelectItem>
                                            <SelectItem value="IncadevUns\\CoreDomain\\Models\\Proceso">Proceso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Elemento a Auditar */}
                        <FormField
                            control={form.control}
                            name="auditable_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Elemento a Auditar</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el elemento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Sistema de Notas UNS</SelectItem>
                                            <SelectItem value="2">Sistema de Matrícula</SelectItem>
                                            <SelectItem value="3">Proceso de Admisión</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Resumen */}
                        <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resumen</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe el propósito y alcance de esta auditoría..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Crear Auditoría
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}