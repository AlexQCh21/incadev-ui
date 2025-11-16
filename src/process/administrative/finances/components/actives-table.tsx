import type { FC } from "react";
import { BookOpen } from "lucide-react";
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


interface Activo {
  id: string;
  curso: string;
  precio_curso: number;
  total_matriculas: number;
  ingresos_verificados: number;
  ingresos_pendientes: number;
  estudiantes_activos: number;
  estudiantes_completados: number;
}

interface Props {
  activos: Activo[];
}

const ActivosTable: FC<Props> = ({ activos }) => {
  
  if (activos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            Activos - Ingresos por Curso
          </CardTitle>
          <CardDescription>No hay datos de cursos activos disponibles</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron cursos activos con ingresos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          Activos - Ingresos por Curso
        </CardTitle>
        <CardDescription>
          Detalle de ingresos verificados y pendientes por programa
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Curso</TableHead>
              <TableHead className="text-right">Matrículas</TableHead>
              <TableHead className="text-right">Verificados</TableHead>
              <TableHead className="text-right">Pendientes</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activos.map((activo) => (
              <TableRow key={activo.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{activo.curso}</p>
                    <p className="text-xs text-muted-foreground">
                      {activo.estudiantes_activos} activos /{" "}
                      {activo.estudiantes_completados} completados
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Badge variant="outline">{activo.total_matriculas}</Badge>
                </TableCell>

                <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  {new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(activo.ingresos_verificados)}
                </TableCell>

                <TableCell className="text-right text-amber-600 dark:text-amber-400 font-medium">
                  {new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(activo.ingresos_pendientes)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivosTable;
