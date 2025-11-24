import { authenticatedFetch } from './authService';
import { config as marketingConfig } from '../../config/marketing-config';

// ============================================
// TYPES
// ============================================

export interface StudentStatsFromAPI {
    pendientes: number;
    cursando: number;
    completados: number;
    reprobados: number;
    desertores: number;
    egresados: number;
    total_matriculados: number;
}

export interface StudentStatsForUI {
    pendientes: number;
    cursando: number;
    completados: number;
    reprobados: number;
    desertores: number;
    egresados: number;
    totalMatriculados: number;
}

export interface StudentResumenFromAPI {
    estadisticas: {
        matriculados: number;
        inactivos: number;
        egresados: number;
        pendientes: number;
        completados: number;
        solicitudes_info: number;
    };
    grupos: {
        activos: number;
        en_inscripcion: number;
    };
    total_estudiantes: number;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Obtiene estadísticas básicas de alumnos para el dashboard
 * GET /api/alumnos/stats
 */
export async function fetchStudentStats(): Promise<StudentStatsForUI> {
    try {
        const endpoint = marketingConfig.endpoints.alumnos.stats;
        const url = `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[studentStatsService] Fetching stats from:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StudentStatsFromAPI = await response.json();
        console.log('[studentStatsService] Stats received:', data);

        return {
            pendientes: data.pendientes,
            cursando: data.cursando,
            completados: data.completados,
            reprobados: data.reprobados,
            desertores: data.desertores,
            egresados: data.egresados,
            totalMatriculados: data.total_matriculados,
        };
    } catch (error) {
        console.error('[studentStatsService] Error fetching stats:', error);
        // Retornar valores por defecto en caso de error
        return {
            pendientes: 0,
            cursando: 0,
            completados: 0,
            reprobados: 0,
            desertores: 0,
            egresados: 0,
            totalMatriculados: 0,
        };
    }
}

/**
 * Obtiene resumen completo de alumnos
 * GET /api/alumnos/resumen
 */
export async function fetchStudentResumen(): Promise<StudentResumenFromAPI | null> {
    try {
        const endpoint = marketingConfig.endpoints.alumnos.resumen;
        const url = `${marketingConfig.apiUrl}/api${endpoint}`;

        console.log('[studentStatsService] Fetching resumen from:', url);

        const response = await authenticatedFetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StudentResumenFromAPI = await response.json();
        console.log('[studentStatsService] Resumen received:', data);

        return data;
    } catch (error) {
        console.error('[studentStatsService] Error fetching resumen:', error);
        return null;
    }
}
