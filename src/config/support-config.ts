/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 * para esto, se ha creado un objeto config que contiene la url de la api y los endpoints.
 **/

export const config = {
  //apiUrl:"https://instituto.cetivirgendelapuerta.com/academico/backend/public",
  apiUrl:"http://127.0.0.1:8000",
  environment:"development",
  endpoints: {
    tutoring: {
      // Endpoints para tutores/profesores
      teacherRequests: "/api/tutoring/requests",
      acceptRequest: "/api/tutoring/requests/:id/accept",
      rejectRequest: "/api/tutoring/requests/:id/reject",
      markAttendance: "/api/tutoring/requests/:id/mark-attendance",
      teacherHistory: "/api/tutoring/history",
      myAvailability: "/api/tutoring/my-availability",
      createAvailability: "/api/tutoring/availability",
      deleteAvailability: "/api/tutoring/availability/:id"
    }
  },
};