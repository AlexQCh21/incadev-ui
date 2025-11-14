/**
 * @abstract API Service Layer
 * @description Capa de abstracción para manejar todas las peticiones a la API REST del módulo tecnológico.
 * Proporciona un cliente HTTP centralizado con manejo de autenticación, errores y tipos.
 */

import { config } from "@/config/technology-config";

// ============================================
// Types & Interfaces
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  requires_2fa?: boolean;
}

// Respuesta de /auth/me con estructura anidada
export interface MeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

// Respuesta de /auth/profile con estructura anidada
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  fullname?: string;
  dni?: string;
  phone?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
  two_factor_enabled?: boolean;
  recovery_email?: string;
  recovery_email_verified?: boolean;
}

export interface UpdateProfileData {
  name?: string;
  fullname?: string;
  email?: string;
  dni?: string;
  phone?: string;
  avatar?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// API Error Class
// ============================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================
// HTTP Client
// ============================================

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Obtiene el token de autenticación del localStorage
   */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    // Limpia comillas si existen
    return token.replace(/^"|"$/g, "");
  }

  /**
   * Construye los headers para las peticiones
   */
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Reemplaza parámetros en la URL (ej: /users/:id -> /users/1)
   */
  private replaceUrlParams(url: string, params: Record<string, string | number>): string {
    let finalUrl = url;
    Object.entries(params).forEach(([key, value]) => {
      finalUrl = finalUrl.replace(`:${key}`, String(value));
    });
    return finalUrl;
  }

  /**
   * Maneja errores HTTP y los convierte en ApiError
   * NOTA: 422 con requires_2fa NO es un error, es una respuesta válida
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    // Si la respuesta es JSON, parseamos el body primero
    let jsonData: any = null;
    if (isJson) {
      jsonData = await response.json();
    }

    if (!response.ok) {
      // Caso especial: 422 con requires_2fa es una respuesta válida, NO un error
      if (response.status === 422 && jsonData?.requires_2fa) {
        return jsonData as T;
      }

      // Error 401: Token inválido o expirado - limpiar sesión automáticamente
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Solo redirigir si no estamos ya en la página de login
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/tecnologico/login";
          }
        }
      }

      // Errores reales
      if (jsonData) {
        throw new ApiError(
          jsonData.message || `Error ${response.status}: ${response.statusText}`,
          response.status,
          jsonData.errors
        );
      } else {
        throw new ApiError(
          `Error ${response.status}: ${response.statusText}`,
          response.status
        );
      }
    }

    // Respuesta exitosa
    if (jsonData) {
      return jsonData as T;
    }

    return {} as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>, urlParams?: Record<string, string | number>): Promise<T> {
    let url = urlParams ? this.replaceUrlParams(endpoint, urlParams) : endpoint;

    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, urlParams?: Record<string, string | number>, includeAuth: boolean = true): Promise<T> {
    const url = urlParams ? this.replaceUrlParams(endpoint, urlParams) : endpoint;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, urlParams?: Record<string, string | number>): Promise<T> {
    const url = urlParams ? this.replaceUrlParams(endpoint, urlParams) : endpoint;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, urlParams?: Record<string, string | number>): Promise<T> {
    const url = urlParams ? this.replaceUrlParams(endpoint, urlParams) : endpoint;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Instancia única del cliente
const apiClient = new ApiClient();

// ============================================
// API Service Methods
// ============================================

export const technologyApi = {
  // ========== Authentication ==========
  auth: {
    /**
     * Inicia sesión con email, password y role
     */
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      return apiClient.post<ApiResponse<AuthResponse>>(
        config.endpoints.auth.login,
        credentials,
        undefined,
        false // No incluir auth header
      );
    },

    /**
     * Registra un nuevo usuario
     */
    register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
      return apiClient.post<ApiResponse<AuthResponse>>(
        config.endpoints.auth.register,
        data,
        undefined,
        false
      );
    },

    /**
     * Cierra sesión
     */
    logout: async (): Promise<ApiResponse<null>> => {
      return apiClient.post<ApiResponse<null>>(config.endpoints.auth.logout);
    },

    /**
     * Obtiene el usuario autenticado
     * Responde con: { success: true, data: { user: {...} } }
     */
    me: async (): Promise<MeResponse> => {
      return apiClient.get<MeResponse>(config.endpoints.auth.me);
    },

    /**
     * Actualiza el perfil del usuario autenticado
     * Responde con: { success: true, message: "...", data: { user: {...} } }
     */
    updateProfile: async (data: UpdateProfileData): Promise<ProfileResponse> => {
      return apiClient.put<ProfileResponse>(config.endpoints.auth.profile, data);
    },
    
    /**
     * Solicita un email de recuperación de contraseña
     */
    forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
      return apiClient.post<ApiResponse<null>>(
        config.endpoints.auth.forgotPassword,
        { email },
        undefined,
        false
      );
    },

    /**
     * Restablece la contraseña con el token recibido
     */
    resetPassword: async (data: {
      email: string;
      token: string;
      password: string;
      password_confirmation: string;
    }): Promise<ApiResponse<null>> => {
      return apiClient.post<ApiResponse<null>>(
        config.endpoints.auth.resetPassword,
        data,
        undefined,
        false
      );
    },
  },

  // ========== 2FA ==========
  twoFactor: {
    /**
     * Habilita 2FA para el usuario
     */
    enable: async (): Promise<ApiResponse<{ qr_code: string; secret: string; recovery_codes: string[] }>> => {
      return apiClient.post(config.endpoints.twoFactor.enable);
    },

    /**
     * Verifica y activa 2FA con el código
     */
    verify: async (code: string): Promise<ApiResponse<null>> => {
      return apiClient.post(config.endpoints.twoFactor.verify, { code });
    },

    /**
     * Verifica el código 2FA en el login
     */
    verifyLogin: async (email: string, password: string, code: string, role: string): Promise<ApiResponse<AuthResponse>> => {
      return apiClient.post<ApiResponse<AuthResponse>>(
        config.endpoints.twoFactor.verifyLogin,
        { email, password, code, role },
        undefined,
        false
      );
    },

    /**
     * Deshabilita 2FA
     */
    disable: async (password: string): Promise<ApiResponse<null>> => {
      return apiClient.post(config.endpoints.twoFactor.disable, { password });
    },

    /**
     * Regenera códigos de recuperación
     */
    regenerateRecoveryCodes: async (password: string): Promise<ApiResponse<{ recovery_codes: string[] }>> => {
      return apiClient.post(config.endpoints.twoFactor.regenerateRecoveryCodes, { password });
    },
  },

  // ========== Recovery Email ==========
  recoveryEmail: {
    /**
     * Agrega un email de recuperación
     */
    add: async (recoveryEmail: string): Promise<ApiResponse<null>> => {
      return apiClient.post(config.endpoints.recoveryEmail.add, { recovery_email: recoveryEmail });
    },

    /**
     * Verifica el email de recuperación con código
     */
    verify: async (code: string): Promise<ApiResponse<null>> => {
      return apiClient.post(config.endpoints.recoveryEmail.verify, { code });
    },

    /**
     * Reenvía el código de verificación
     */
    resendCode: async (): Promise<ApiResponse<null>> => {
      return apiClient.post(config.endpoints.recoveryEmail.resendCode);
    },

    /**
     * Elimina el email de recuperación
     */
    remove: async (): Promise<ApiResponse<null>> => {
      return apiClient.delete(config.endpoints.recoveryEmail.remove);
    },
  },

  // ========== Users Management ==========
  users: {
    /**
     * Lista todos los usuarios con paginación
     */
    list: async (page?: number, perPage?: number, search?: string): Promise<ApiResponse<PaginatedResponse<User>>> => {
      const params: Record<string, string | number> = {};
      if (page) params.page = page;
      if (perPage) params.per_page = perPage;
      if (search) params.search = search;

      return apiClient.get<ApiResponse<PaginatedResponse<User>>>(config.endpoints.users.list, params);
    },

    /**
     * Obtiene un usuario por ID
     */
    getById: async (id: number): Promise<ApiResponse<User>> => {
      return apiClient.get<ApiResponse<User>>(config.endpoints.users.getById, undefined, { id });
    },

    /**
     * Crea un nuevo usuario
     */
    create: async (data: { name: string; email: string; password: string; roles?: string[] }): Promise<ApiResponse<User>> => {
      return apiClient.post<ApiResponse<User>>(config.endpoints.users.create, data);
    },

    /**
     * Actualiza un usuario
     */
    update: async (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
      return apiClient.put<ApiResponse<User>>(config.endpoints.users.update, data, { id });
    },

    /**
     * Elimina un usuario
     */
    delete: async (id: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<ApiResponse<null>>(config.endpoints.users.delete, { id });
    },

    /**
     * Asigna roles a un usuario
     */
    assignRoles: async (id: number, roles: string[]): Promise<ApiResponse<User>> => {
      return apiClient.post<ApiResponse<User>>(config.endpoints.users.assignRoles, { roles }, { id });
    },

    /**
     * Asigna permisos a un usuario
     */
    assignPermissions: async (id: number, permissions: string[]): Promise<ApiResponse<User>> => {
      return apiClient.post<ApiResponse<User>>(config.endpoints.users.assignPermissions, { permissions }, { id });
    },
  },

  // ========== Roles Management ==========
  roles: {
    /**
     * Lista todos los roles
     */
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiClient.get<ApiResponse<any[]>>(config.endpoints.roles.list);
    },

    /**
     * Crea un nuevo rol
     */
    create: async (data: { name: string; permissions?: string[] }): Promise<ApiResponse<any>> => {
      return apiClient.post<ApiResponse<any>>(config.endpoints.roles.create, data);
    },

    /**
     * Obtiene un rol por ID
     */
    getById: async (id: number): Promise<ApiResponse<any>> => {
      return apiClient.get<ApiResponse<any>>(config.endpoints.roles.getById, undefined, { id });
    },

    /**
     * Actualiza un rol
     */
    update: async (id: number, data: { name?: string; permissions?: string[] }): Promise<ApiResponse<any>> => {
      return apiClient.put<ApiResponse<any>>(config.endpoints.roles.update, data, { id });
    },

    /**
     * Elimina un rol
     */
    delete: async (id: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<ApiResponse<null>>(config.endpoints.roles.delete, { id });
    },

    /**
     * Asigna permisos a un rol
     */
    assignPermissions: async (id: number, permissions: string[]): Promise<ApiResponse<any>> => {
      return apiClient.post<ApiResponse<any>>(config.endpoints.roles.assignPermissions, { permissions }, { id });
    },
  },

  // ========== Permissions Management ==========
  permissions: {
    /**
     * Lista todos los permisos
     */
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiClient.get<ApiResponse<any[]>>(config.endpoints.permissions.list);
    },

    /**
     * Crea un nuevo permiso
     */
    create: async (data: { name: string }): Promise<ApiResponse<any>> => {
      return apiClient.post<ApiResponse<any>>(config.endpoints.permissions.create, data);
    },

    /**
     * Obtiene un permiso por ID
     */
    getById: async (id: number): Promise<ApiResponse<any>> => {
      return apiClient.get<ApiResponse<any>>(config.endpoints.permissions.getById, undefined, { id });
    },

    /**
     * Actualiza un permiso
     */
    update: async (id: number, data: { name: string }): Promise<ApiResponse<any>> => {
      return apiClient.put<ApiResponse<any>>(config.endpoints.permissions.update, data, { id });
    },

    /**
     * Elimina un permiso
     */
    delete: async (id: number): Promise<ApiResponse<null>> => {
      return apiClient.delete<ApiResponse<null>>(config.endpoints.permissions.delete, { id });
    },
  },
};

// ============================================
// Helpers
// ============================================

/**
 * Guarda la sesión en localStorage
 */
export const saveAuthSession = (token: string, user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Limpia la sesión del localStorage
 */
export const clearAuthSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Obtiene el usuario del localStorage
 */
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Obtiene el token del localStorage
 */
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token ? token.replace(/^"|"$/g, "") : null;
};
