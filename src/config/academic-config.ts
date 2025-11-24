/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 * para esto, se ha creado un objeto config que contiene la url de la api y los endpoints.
 **/

export const config = {
  apiUrl:"https://instituto.cetivirgendelapuerta.com/backend/academico/public",
  //apiUrl:"http://127.0.0.1:8002",
  tutoringApiUrl:"http://127.0.0.1:8000",
  environment:"development",
  endpoints: {
    users: {
      updateDNI: "/api/update-dni-and-fullname",
      checkDNI: "/api/get-fullname-by-dni",
    },
    auth: {
      register: "/api/auth/register",
      redirect: "/auth/google/redirect",
      callback: "/auth/google/callback",
    },
    groups:{
      available: "/api/available-groups",
      enroll: "/api/available-groups/:group/enroll",
      mylist: "/api/enrolled-groups",
      infoEnroll: "/api/enrolled-groups/:group",
      listComplete: "/api/student/completed-groups",
      certificate: "/api/student/certificates/:uuid/download",
      teaching: "/api/teaching-groups",
      specificTeaching: "/api/teaching-groups/:group",
      canComplete: "/api/teaching-groups/:group/can-complete",
      complete: "/api/teaching-groups/:group/complete",
    },
    classes:{
      listAll: "/api/teaching-groups/:group/classes",
      create: "/api/teaching-groups/:group/modules/:module/classes",
      update: "/api/teaching-groups/classes/:class",
      delete: "/api/teaching-groups/classes/:class",
    },
    materials:{
      listAll: "/api/teaching-groups/classes/:class/materials",
      create: "/api/teaching-groups/classes/:class/materials",
      update: "/api/teaching-groups/materials/:material",
      delete: "/api/teaching-groups/materials/:material",
    },
    exams:{
      listAll: "/api/teaching-groups/:group/exams",
      create: "/api/teaching-groups/:group/modules/:module/exams",
      info: "/api/teaching-groups/exams/:exam",
      update: "/api/teaching-groups/exams/:exam",
      delete: "/api/teaching-groups/exams/:exam",
      registerGrades: "/api/teaching-groups/exams/:exam/grades",
      updateGrade: "/api/teaching-groups/grades/:grade"
    },
    attendances: {
      listAll: "/api/teaching-groups/:group/attendances",
      info: "/api/teaching-groups/classes/:class/attendances",
      register: "/api/teaching-groups/classes/:class/attendances",
      update: "/api/teaching-groups/attendances/:attendance",
      statistics: "/api/teaching-groups/:group/attendance-statistics"
    },
    marketing: {
      students: "/api/marketing/students"
    },
    tutoring: {
      // Endpoints para estudiantes
      studentRequests: "/api/tutoring/my-requests",
      createRequest: "/api/tutoring/requests",
      teachers: "/api/tutoring/teachers",
      teacherAvailability: "/api/tutoring/availabilities/:teacherId"
    },
    report: {
      studentGroups: "/api/report/student-groups",
      groupGrades: "/api/report/group-grades",
      enrolledCoursesPdf: "/api/report/reports/enrolled-courses",
      singleCourseGradesPdf: "/api/report/reports/single-course-grades"
    },
    forums: {
      list: "/api/forums",
      get: "/api/forums/:forumId",
      create: "/api/forums",
      update: "/api/forums/:forumId",
      delete: "/api/forums/:forumId",
    },
    threads: {
      listByForum: "/api/forums/:forumId/threads",
      get: "/api/threads/:threadId",
      create: "/api/forums/:forumId/threads",
      update: "/api/threads/:threadId",
      delete: "/api/threads/:threadId",
    },
    comments: {
      listByThread: "/api/threads/:threadId/comments",
      create: "/api/threads/:threadId/comments",
      update: "/api/comments/:commentId",
      delete: "/api/comments/:commentId",
    },
    votes: {
      voteThread: "/api/threads/:threadId/votes",
      voteComment: "/api/comments/:commentId/votes",
    }
  },
};