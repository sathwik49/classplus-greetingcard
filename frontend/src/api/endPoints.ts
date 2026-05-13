export const endPoints = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  USER: {
    ME: "/user/me",
  },
  TEMPLATES: {
    ALL: "/template/all",
    BY_ID: (id: string) => `/template/${id}`,
  },
};

export const AUTH_REDIRECT_URL = "/";
