/**
 * @abstract Config file
 * @description Este archivo contiene la configuracion de la aplicacion.
 * para esto, se ha creado un objeto config que contiene la url de la api y los endpoints.
 **/

export const config = {
  //apiUrl:"https://instituto.cetivirgendelapuerta.com/procesostecnologicos/backend/public/api",
  apiUrl:"http://localhost:8000/api",
  environment:"development",
  endpoints: {
    // Authentication
    auth: {
      register: "/auth/register",
      login: "/auth/login",
      logout: "/auth/logout",
      me: "/auth/me",
      profile: "/auth/profile",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
    },

    // Recovery Email
    recoveryEmail: {
      add: "/auth/recovery-email/add",
      verify: "/auth/recovery-email/verify",
      resendCode: "/auth/recovery-email/resend-code",
      remove: "/auth/recovery-email/remove",
    },

    // Two-Factor Authentication (2FA)
    twoFactor: {
      enable: "/auth/2fa/enable",
      verify: "/auth/2fa/verify",
      verifyLogin: "/auth/2fa/verify-login",
      disable: "/auth/2fa/disable",
      regenerateRecoveryCodes: "/auth/2fa/recovery-codes/regenerate",
    },

    // Users Management
    users: {
      list: "/users",
      create: "/users",
      getById: "/users/:id",
      update: "/users/:id",
      delete: "/users/:id",
      assignRoles: "/users/:id/roles",
      assignPermissions: "/users/:id/permissions",
    },

    // Roles Management
    roles: {
      list: "/roles",
      create: "/roles",
      getById: "/roles/:id",
      update: "/roles/:id",
      delete: "/roles/:id",
      assignPermissions: "/roles/:id/permissions",
    },

    // Permissions Management
    permissions: {
      list: "/permissions",
      create: "/permissions",
      getById: "/permissions/:id",
      update: "/permissions/:id",
      delete: "/permissions/:id",
    },
  },
};