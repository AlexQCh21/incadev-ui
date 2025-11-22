// src/process/evaluation/surveys/services/survey-service.ts

import { config } from "@/config/evaluation-config"
import type { 
  Survey, 
  SurveyFormData, 
  SurveyResponse, 
  PaginatedSurveyResponse 
} from "@/process/evaluation/surveys/types/survey"

const getAuthToken = (): string => {
  const token = localStorage.getItem("token") || ""
  return token.replace(/^"|"$/g, "")
}

const headers = () => ({
  "Authorization": `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
})

export const surveyService = {
  async listAll(page: number = 1): Promise<PaginatedSurveyResponse> {
    const res = await fetch(
      `${config.apiUrl}${config.endpoints.surveys.listAll}?page=${page}`,
      { method: "GET", headers: headers() }
    )
    if (!res.ok) throw new Error("Error al obtener encuestas")
    return res.json()
  },

  async show(id: number): Promise<SurveyResponse<Survey>> {
    const url = `${config.apiUrl}${config.endpoints.surveys.show}`.replace(":id", String(id))
    const res = await fetch(url, { method: "GET", headers: headers() })
    if (!res.ok) throw new Error("Error al obtener encuesta")
    return res.json()
  },

  async create(data: SurveyFormData): Promise<SurveyResponse<Survey>> {
    const res = await fetch(
      `${config.apiUrl}${config.endpoints.surveys.create}`,
      { method: "POST", headers: headers(), body: JSON.stringify(data) }
    )
    if (!res.ok) throw new Error("Error al crear encuesta")
    return res.json()
  },

  async update(id: number, data: SurveyFormData): Promise<SurveyResponse<Survey>> {
    const url = `${config.apiUrl}${config.endpoints.surveys.update}`.replace(":id", String(id))
    const res = await fetch(url, { method: "PUT", headers: headers(), body: JSON.stringify(data) })
    if (!res.ok) throw new Error("Error al actualizar encuesta")
    return res.json()
  },

  async delete(id: number): Promise<SurveyResponse<null>> {
    const url = `${config.apiUrl}${config.endpoints.surveys.delete}`.replace(":id", String(id))
    const res = await fetch(url, { method: "DELETE", headers: headers() })
    if (!res.ok) throw new Error("Error al eliminar encuesta")
    return res.json()
  },
}