import AdministrativeLayout from "@/process/administrative/AdministrativeLayout";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BookOpen,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============== COMPONENTE: Metric Card ==============
const MetricCard = ({
  icon: Icon,
  label,
  value,
  change,
  isPositive,
  format = "number",
}) => {
  const formatValue = (val) => {
    if (format === "currency") return `$${val.toLocaleString()}`;
    if (format === "percentage") return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <p className="text-2xl font-bold mt-1">{formatValue(value)}</p>
            </div>
          </div>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="ml-2"
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE: Filtros ==============
const ReportFilters = ({ filters, onFilterChange, onApply }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros del Reporte
        </CardTitle>
        <CardDescription>
          Personaliza el período y tipo de reporte que deseas visualizar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select
              value={filters.timeRange}
              onValueChange={(value) => onFilterChange("timeRange", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Reporte</label>
            <Select
              value={filters.reportType}
              onValueChange={(value) => onFilterChange("reportType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="revenue">Ingresos</SelectItem>
                <SelectItem value="expenses">Gastos</SelectItem>
                <SelectItem value="courses">Por Curso</SelectItem>
                <SelectItem value="students">Por Estudiante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="programming">Programación</SelectItem>
                <SelectItem value="design">Diseño</SelectItem>
                <SelectItem value="business">Negocios</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={onApply} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE: Tabla de Detalles ==============
const DetailsTable = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle por Curso</CardTitle>
        <CardDescription>
          Análisis detallado del rendimiento de cada curso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Curso</th>
                <th className="text-right p-3 font-semibold">Ingresos</th>
                <th className="text-right p-3 font-semibold">Estudiantes</th>
                <th className="text-right p-3 font-semibold">
                  Tasa de Finalización
                </th>
                <th className="text-right p-3 font-semibold">Calificación</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                  </td>
                  <td className="text-right p-3 font-medium">
                    ${item.revenue?.toLocaleString()}
                  </td>
                  <td className="text-right p-3">
                    {item.enrollments?.toLocaleString()}
                  </td>
                  <td className="text-right p-3">
                    <Badge
                      variant={
                        item.completionRate >= 70 ? "default" : "secondary"
                      }
                    >
                      {item.completionRate}%
                    </Badge>
                  </td>
                  <td className="text-right p-3">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-medium">{item.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE: Gráfico de Ingresos ==============
const RevenueChart = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
        <CardDescription>
          Evolución de ingresos en los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Ingresos"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              name="Gastos"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE: Gráfico de Distribución ==============
const DistributionChart = ({ data }) => {
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Ingresos</CardTitle>
        <CardDescription>Ingresos por categoría de curso</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE: Comparación de Cursos ==============
const CoursesComparison = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Cursos</CardTitle>
        <CardDescription>Top 5 cursos por ingresos</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Ingresos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE: Resumen Ejecutivo ==============
const ExecutiveSummary = ({ summary }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Ejecutivo</CardTitle>
        <CardDescription>
          Vista general del rendimiento financiero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Ingresos Totales</span>
            <span className="text-lg font-bold text-green-600">
              ${summary.totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Gastos Totales</span>
            <span className="text-lg font-bold text-red-600">
              ${summary.totalExpenses.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
            <span className="font-semibold">Utilidad Neta</span>
            <span
              className={`text-xl font-bold ${
                summary.netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${summary.netProfit.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">
                Margen de Utilidad
              </p>
              <p className="text-lg font-bold">
                {((summary.netProfit / summary.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className="text-lg font-bold">
                {((summary.netProfit / summary.totalExpenses) * 100).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============== COMPONENTE PRINCIPAL ==============
const FinancialReportsView = () => {
  const reportRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: "month",
    reportType: "general",
    category: "all",
  });

  // Datos de ejemplo
  const metrics = [
    {
      icon: DollarSign,
      label: "Ingresos Totales",
      value: 245800,
      change: 12.5,
      isPositive: true,
      format: "currency",
    },
    {
      icon: Users,
      label: "Estudiantes Activos",
      value: 1842,
      change: 8.3,
      isPositive: true,
      format: "number",
    },
    {
      icon: BookOpen,
      label: "Cursos Vendidos",
      value: 456,
      change: -3.2,
      isPositive: false,
      format: "number",
    },
    {
      icon: TrendingUp,
      label: "Tasa de Conversión",
      value: 23.8,
      change: 5.7,
      isPositive: true,
      format: "percentage",
    },
  ];

  const chartData = [
    {
      name: "React Avanzado",
      revenue: 45000,
      enrollments: 234,
      completionRate: 78,
      category: "Programación",
      rating: 4.8,
    },
    {
      name: "Diseño UI/UX",
      revenue: 38000,
      enrollments: 189,
      completionRate: 82,
      category: "Diseño",
      rating: 4.9,
    },
    {
      name: "Marketing Digital",
      revenue: 42000,
      enrollments: 312,
      completionRate: 71,
      category: "Marketing",
      rating: 4.6,
    },
    {
      name: "Python para Data Science",
      revenue: 51000,
      enrollments: 278,
      completionRate: 85,
      category: "Programación",
      rating: 4.9,
    },
    {
      name: "Gestión de Proyectos",
      revenue: 33000,
      enrollments: 156,
      completionRate: 68,
      category: "Negocios",
      rating: 4.5,
    },
    {
      name: "JavaScript Moderno",
      revenue: 36800,
      enrollments: 201,
      completionRate: 75,
      category: "Programación",
      rating: 4.7,
    },
  ];

  const monthlyData = [
    { month: "Ene", revenue: 38000, expenses: 25000 },
    { month: "Feb", revenue: 42000, expenses: 28000 },
    { month: "Mar", revenue: 39000, expenses: 26000 },
    { month: "Abr", revenue: 45000, expenses: 29000 },
    { month: "May", revenue: 48000, expenses: 31000 },
    { month: "Jun", revenue: 51000, expenses: 32000 },
  ];

  const distributionData = [
    { name: "Programación", value: 132800 },
    { name: "Diseño", value: 38000 },
    { name: "Marketing", value: 42000 },
    { name: "Negocios", value: 33000 },
  ];

  const summary = {
    totalRevenue: 245800,
    totalExpenses: 171000,
    netProfit: 74800,
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    console.log("Aplicando filtros:", filters);
    // Aquí iría la lógica para aplicar filtros
  };

  const handleExportPDF = () => {
    setIsGeneratingPDF(true);
    // Simulación de exportación
    setTimeout(() => {
      alert("PDF generado exitosamente (simulación)");
      setIsGeneratingPDF(false);
    }, 2000);
  };

  const handleQuickExport = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      alert("PDF rápido generado (simulación)");
      setIsGeneratingPDF(false);
    }, 1000);
  };

  return (
    <AdministrativeLayout title="Finanzas | Reportes Financieros">
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Reportes Financieros</h1>
              <p className="text-muted-foreground mt-1">
                Analiza el desempeño financiero y genera reportes profesionales
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleQuickExport}
                disabled={isGeneratingPDF}
              >
                <FileText className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? "Generando..." : "PDF Rápido"}
              </Button>

              <Button onClick={handleExportPDF} disabled={isGeneratingPDF}>
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? "Exportando..." : "Exportar PDF"}
              </Button>
            </div>
          </div>

          {/* Contenido del reporte */}
          <div ref={reportRef} className="space-y-6">
            {/* Filtros */}
            <ReportFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyFilters}
            />

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            {/* Tabs con diferentes vistas */}
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="revenue">Ingresos</TabsTrigger>
                <TabsTrigger value="distribution">Distribución</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <ExecutiveSummary summary={summary} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RevenueChart data={monthlyData} />
                  <CoursesComparison data={chartData} />
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <RevenueChart data={monthlyData} />
                <CoursesComparison data={chartData} />
              </TabsContent>

              <TabsContent value="distribution" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <DistributionChart data={distributionData} />
                  <ExecutiveSummary summary={summary} />
                </div>
              </TabsContent>

              <TabsContent value="details">
                <DetailsTable data={chartData} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer informativo */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Última actualización:{" "}
                    {new Date().toLocaleDateString("es-ES")}
                  </span>
                </div>
                <span>Datos actualizados en tiempo real</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdministrativeLayout>
  );
};

export default FinancialReportsView;
