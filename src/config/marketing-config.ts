/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 * para esto, se ha creado un objeto config que contiene la url de la api y los endpoints.
 **/

export const config = {
  apiUrl: "https://instituto.cetivirgendelapuerta.com/academico/backend/marketing",
  //apiUrl: "http://127.0.0.1:8000",
  environment: "development",

  endpoints: {
    // Propuestas
    propuestas: {
      list: "/propuestas",
      create: "/propuestas",
      detail: "/propuestas/:id",
      update: "/propuestas/:id",
      delete: "/propuestas/:id",
    },

    // Campañas
    campañas: {
      list: "/campañas",
      create: "/campañas",
      detail: "/campañas/:id",
      update: "/campañas/:id",
      delete: "/campañas/:id",
      stats: "/campañas/:id/stats",
    },

    // Chatbot
    chatbot: {
      conversaciones: "/chatbot/conversaciones",
      conversacionDetail: "/chatbot/conversaciones/:id",
      sendMessage: "/chatbot/conversaciones/:id/mensaje",
      estadisticas: "/chatbot/estadisticas",
      automatizaciones: "/chatbot/automatizaciones",
      canales: "/chatbot/canales",
      configurarCanal: "/chatbot/canales/:id/configurar",
      testCanal: "/chatbot/canales/:id/test",
    },

    // Métricas
    metricas: {
      general: "/metricas",
      chatbot: "/metricas/chatbot",
      campañas: "/metricas/campañas",
      propuestas: "/metricas/propuestas",
      tendencias: "/metricas/tendencias",
    },

    // Cursos (para marketing)
    cursos: {
      list: "/cursos",
      detail: "/cursos/:id",
      proximos: "/cursos/proximos",
    },

    // Alumnos (para marketing)
    alumnos: {
      resumen: "/alumnos/resumen",
      stats: "/alumnos/stats",
    },
  },

  // URLs externas y webhooks
  externalUrls: {
    webhook: {
      whatsapp: "https://instituto.cetivirgendelapuerta.com/api/webhook/wa",
      messenger: "https://instituto.cetivirgendelapuerta.com/api/webhook/messenger",
      instagram: "https://instituto.cetivirgendelapuerta.com/api/webhook/instagram",
      facebook: "https://instituto.cetivirgendelapuerta.com/api/webhook/facebook",
    },
    matricula: {
      base: "https://instituto.cetivirgendelapuerta.com/matricula",
      curso: "https://instituto.cetivirgendelapuerta.com/matricula/:slug",
    },
  },
};