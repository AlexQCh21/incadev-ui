import React, { useState, useEffect } from "react";
import AdministrativeLayout from '@/process/administrative/AdministrativeLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/process/administrative/academic-processes/components/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowsSort } from "@tabler/icons-react";

import {
  Package,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  FileSpreadsheet,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Archive,
  Layers,
  Copy,
} from "lucide-react";

// Tipos
interface Course {
  id: number;
  name: string;
}

interface CourseVersion {
  id: number;
  course_id: number;
  version: string;
  name: string;
  price: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  course?: Course;
  modules_count?: number;
  groups_count?: number;
  students_count?: number;
}

interface VersionStats {
  total_versions: number;
  published_versions: number;
  draft_versions: number;
  archived_versions: number;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Mock data
const mockCourses: Course[] = [
  { id: 1, name: "Inteligencia Artificial y Data Science" },
  { id: 2, name: "Gestión de Proyectos de Transformación Digital" },
  { id: 3, name: "Desarrollo Web y Cloud Computing" },
];

const mockVersions: CourseVersion[] = [
  {
    id: 1,
    course_id: 1,
    version: "2025-01",
    name: "IA-DS-2025-01",
    price: 350.0,
    status: "published",
    created_at: "2025-11-21T08:15:31.000000Z",
    updated_at: "2025-11-21T08:15:31.000000Z",
    modules_count: 3,
    groups_count: 2,
    students_count: 45,
  },
  {
    id: 2,
    course_id: 2,
    version: "2025-01",
    name: "GP-TD-2025-01",
    price: 300.0,
    status: "published",
    created_at: "2025-11-21T08:15:31.000000Z",
    updated_at: "2025-11-21T08:15:31.000000Z",
    modules_count: 3,
    groups_count: 2,
    students_count: 38,
  },
  {
    id: 3,
    course_id: 3,
    version: "2025-01",
    name: "DW-CC-2025-01",
    price: 320.0,
    status: "published",
    created_at: "2025-11-21T08:15:31.000000Z",
    updated_at: "2025-11-21T08:15:31.000000Z",
    modules_count: 3,
    groups_count: 1,
    students_count: 52,
  },
  {
    id: 4,
    course_id: 1,
    version: "2024-02",
    name: "IA-DS-2024-02",
    price: 320.0,
    status: "archived",
    created_at: "2024-08-15T08:15:31.000000Z",
    updated_at: "2025-01-10T08:15:31.000000Z",
    modules_count: 3,
    groups_count: 0,
    students_count: 28,
  },
  {
    id: 5,
    course_id: 2,
    version: "2025-02",
    name: "GP-TD-2025-02",
    price: 310.0,
    status: "draft",
    created_at: "2025-11-18T08:15:31.000000Z",
    updated_at: "2025-11-20T08:15:31.000000Z",
    modules_count: 2,
    groups_count: 0,
    students_count: 0,
  },
];

export default function CourseVersionsManagement() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [versions, setVersions] = useState<CourseVersion[]>(mockVersions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof CourseVersion | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const [selectedVersion, setSelectedVersion] = useState<CourseVersion | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<CourseVersion | null>(
    null
  );
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Paginación
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });

  // Estadísticas
  const stats: VersionStats = {
    total_versions: versions.length,
    published_versions: versions.filter((v) => v.status === "published").length,
    draft_versions: versions.filter((v) => v.status === "draft").length,
    archived_versions: versions.filter((v) => v.status === "archived").length,
  };

  // Form state
  const [formData, setFormData] = useState({
    course_id: "",
    version: "",
    name: "",
    price: "",
    status: "draft" as "draft" | "published" | "archived",
  });

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSort = (column: keyof CourseVersion) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCourseFilter("all");
    setSortColumn(null);
    setSortDirection("desc");
  };

  const handleOpenForm = (mode: "create" | "edit", version?: CourseVersion) => {
    setFormMode(mode);

    if (mode === "edit" && version) {
      setFormData({
        course_id: version.course_id.toString(),
        version: version.version,
        name: version.name,
        price: version.price.toString(),
        status: version.status,
      });
      setSelectedVersion(version);
    } else {
      setFormData({
        course_id: "",
        version: "",
        name: "",
        price: "",
        status: "draft",
      });
      setSelectedVersion(null);
    }

    setIsFormModalOpen(true);
  };

  const handleDuplicateVersion = (version: CourseVersion) => {
    setFormData({
      course_id: version.course_id.toString(),
      version: "",
      name: version.name + " (Copia)",
      price: version.price.toString(),
      status: "draft",
    });
    setSelectedVersion(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = () => {
    console.log("Submitting form:", formData);
    setIsFormModalOpen(false);
    setFormData({
      course_id: "",
      version: "",
      name: "",
      price: "",
      status: "draft",
    });
  };

  const handleDeleteVersion = (version: CourseVersion) => {
    setVersionToDelete(version);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting version:", versionToDelete);
    setIsDeleteDialogOpen(false);
    setVersionToDelete(null);
  };

  const handleChangeStatus = (
    version: CourseVersion,
    newStatus: "draft" | "published" | "archived"
  ) => {
    console.log("Changing status:", version.id, newStatus);
    // Implementar lógica de cambio de estado
  };

  const exportCSV = () => {
    console.log("Exporting CSV...");
  };

  const exportPDF = () => {
    console.log("Exporting PDF...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Publicado
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Borrador
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20">
            <Archive className="mr-1 h-3 w-3" />
            Archivado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCourseNameById = (courseId: number) => {
    return (
      courses.find((c) => c.id === courseId)?.name || "Curso no encontrado"
    );
  };

  const filteredVersions = versions.filter((version) => {
    const matchesSearch =
      version.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      version.version.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      getCourseNameById(version.course_id)
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || version.status === statusFilter;
    const matchesCourse =
      courseFilter === "all" || version.course_id.toString() === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const sortedVersions = React.useMemo(() => {
    if (!sortColumn) return filteredVersions;

    return [...filteredVersions].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue || "");
      const bString = String(bValue || "");

      if (sortDirection === "asc") {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [filteredVersions, sortColumn, sortDirection]);

  const hasActiveFilters =
    statusFilter !== "all" || courseFilter !== "all" || searchQuery !== "";

  return (
    <AdministrativeLayout title="Docentes por Grupo">
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-gradient-to-br from-violet-500 to-violet-700 px-6 py-7 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-violet-100/90">
                  Gestión Académica
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                  Versiones de Cursos
                </h1>
                <p className="mt-2 max-w-xl text-sm text-violet-100/80">
                  Administra las diferentes versiones y ediciones de cada curso
                </p>
              </div>
              <Button
                onClick={() => handleOpenForm("create")}
                className="bg-white text-violet-600 hover:bg-violet-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Versión
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                    <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Versiones
                    </p>
                    <p className="text-2xl font-bold">{stats.total_versions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Publicadas
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.published_versions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Borradores
                    </p>
                    <p className="text-2xl font-bold">{stats.draft_versions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10">
                    <Archive className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Archivadas
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.archived_versions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle>Listado de Versiones</CardTitle>
                  <CardDescription>
                    Gestiona las versiones de los cursos disponibles en la
                    plataforma
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">
                    {stats.total_versions} versiones
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={exportCSV}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportPDF}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, versión o curso..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-[200px]">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cursos</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Estado
                      {statusFilter !== "all" && (
                        <Badge
                          variant="secondary"
                          className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          1
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "all"}
                      onCheckedChange={() => setStatusFilter("all")}
                    >
                      Todos los estados
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "published"}
                      onCheckedChange={() => setStatusFilter("published")}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                      Publicado
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "draft"}
                      onCheckedChange={() => setStatusFilter("draft")}
                    >
                      <Clock className="mr-2 h-4 w-4 text-amber-600" />
                      Borrador
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "archived"}
                      onCheckedChange={() => setStatusFilter("archived")}
                    >
                      <Archive className="mr-2 h-4 w-4 text-slate-600" />
                      Archivado
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>

              {sortedVersions.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-4 text-muted-foreground">
                    {hasActiveFilters
                      ? "No se encontraron versiones que coincidan con los filtros"
                      : "No hay versiones registradas"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-violet-50 dark:bg-violet-950/20">
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 font-semibold text-violet-700 dark:text-violet-400"
                              onClick={() => handleSort("id")}
                            >
                              ID
                              {sortColumn === "id" ? (
                                sortDirection === "asc" ? (
                                  <ChevronUp className="h-3 w-3" />
                                ) : (
                                  <ChevronDown className="h-3 w-3" />
                                )
                              ) : (
                                <IconArrowsSort className="h-3 w-3 opacity-50" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 font-semibold text-violet-700 dark:text-violet-400"
                              onClick={() => handleSort("name")}
                            >
                              Nombre
                              {sortColumn === "name" ? (
                                sortDirection === "asc" ? (
                                  <ChevronUp className="h-3 w-3" />
                                ) : (
                                  <ChevronDown className="h-3 w-3" />
                                )
                              ) : (
                                <IconArrowsSort className="h-3 w-3 opacity-50" />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400">
                            Curso
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400">
                            Versión
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400">
                            Precio
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400 text-center">
                            Módulos
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400 text-center">
                            Grupos
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400 text-center">
                            Estudiantes
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400">
                            Estado
                          </TableHead>
                          <TableHead className="font-semibold text-violet-700 dark:text-violet-400 text-center">
                            Acciones
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedVersions.map((version) => (
                          <TableRow key={version.id}>
                            <TableCell className="font-semibold">
                              #{version.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {version.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                              {getCourseNameById(version.course_id)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{version.version}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-violet-600">
                              S/. {version.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-700 border-blue-500/20"
                              >
                                {version.modules_count || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="secondary"
                                className="bg-indigo-500/10 text-indigo-700 border-indigo-500/20"
                              >
                                {version.groups_count || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-center">
                              {version.students_count || 0}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(version.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVersion(version);
                                    setIsDetailModalOpen(true);
                                  }}
                                  title="Ver detalles"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenForm("edit", version)
                                  }
                                  title="Editar versión"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDuplicateVersion(version)
                                      }
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicar versión
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Layers className="mr-2 h-4 w-4" />
                                      Ver módulos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Users className="mr-2 h-4 w-4" />
                                      Ver grupos
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>
                                      Cambiar estado
                                    </DropdownMenuLabel>
                                    {version.status !== "published" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleChangeStatus(
                                            version,
                                            "published"
                                          )
                                        }
                                      >
                                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                                        Publicar
                                      </DropdownMenuItem>
                                    )}
                                    {version.status !== "draft" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleChangeStatus(version, "draft")
                                        }
                                      >
                                        <Clock className="mr-2 h-4 w-4 text-amber-600" />
                                        Marcar como borrador
                                      </DropdownMenuItem>
                                    )}
                                    {version.status !== "archived" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleChangeStatus(
                                            version,
                                            "archived"
                                          )
                                        }
                                      >
                                        <Archive className="mr-2 h-4 w-4 text-slate-600" />
                                        Archivar
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteVersion(version)
                                      }
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {sortedVersions.length} de{" "}
                      {stats.total_versions} versiones
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={paginationMeta.current_page === 1}
                      >
                        Anterior
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Página {paginationMeta.current_page} de{" "}
                          {paginationMeta.last_page}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          paginationMeta.current_page ===
                          paginationMeta.last_page
                        }
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Form Modal (Create/Edit) */}
          <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {formMode === "create"
                    ? "Crear Nueva Versión"
                    : "Editar Versión"}
                </DialogTitle>
                <DialogDescription>
                  {formMode === "create"
                    ? "Complete los datos para crear una nueva versión del curso"
                    : "Modifique los datos de la versión"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course_id">Curso *</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, course_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id.toString()}
                        >
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Versión *</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) =>
                        setFormData({ ...formData, version: e.target.value })
                      }
                      placeholder="Ej: 2025-01"
                    />
                    <p className="text-xs text-muted-foreground">
                      Formato: YYYY-MM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (S/.) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="350.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Versión *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: IA-DS-2025-01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nombre identificador único para esta versión
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-amber-600" />
                          Borrador
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                          Publicado
                        </div>
                      </SelectItem>
                      <SelectItem value="archived">
                        <div className="flex items-center">
                          <Archive className="mr-2 h-4 w-4 text-slate-600" />
                          Archivado
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitForm}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {formMode === "create" ? "Crear Versión" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Detail Modal */}
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Detalles de la Versión</DialogTitle>
                <DialogDescription>
                  Información completa de la versión del curso
                </DialogDescription>
              </DialogHeader>

              {selectedVersion && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Estado
                      </p>
                      {getStatusBadge(selectedVersion.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        ID de Versión
                      </p>
                      <p className="text-lg font-semibold">
                        #{selectedVersion.id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nombre de la Versión
                    </p>
                    <p className="text-xl font-semibold">
                      {selectedVersion.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Curso
                      </p>
                      <p className="text-base font-medium">
                        {getCourseNameById(selectedVersion.course_id)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Versión
                      </p>
                      <Badge variant="outline" className="text-base">
                        {selectedVersion.version}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Precio
                    </p>
                    <p className="text-2xl font-bold text-violet-600">
                      S/. {selectedVersion.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Módulos
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedVersion.modules_count || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Grupos
                      </p>
                      <p className="text-3xl font-bold text-indigo-600">
                        {selectedVersion.groups_count || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Estudiantes
                      </p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {selectedVersion.students_count || 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Fecha de Creación
                      </p>
                      <p className="text-base">
                        {new Date(
                          selectedVersion.created_at
                        ).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Última Actualización
                      </p>
                      <p className="text-base">
                        {new Date(
                          selectedVersion.updated_at
                        ).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    if (selectedVersion) {
                      handleOpenForm("edit", selectedVersion);
                    }
                  }}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás seguro de eliminar esta versión?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente
                  la versión
                  <strong className="block mt-2 text-foreground">
                    {versionToDelete?.name}
                  </strong>
                  y todos sus módulos, grupos y datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar Versión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </AdministrativeLayout>
  );
}
