export const queryKeys = {
  REGISTER: ["register"],
  LOGIN: ["login"],
  REFRESH: ["refresh"],
  ME: ["current-user"],
  GET_ALL_TEMPLATES: (category: string) => [category, "all-templates"],
};
