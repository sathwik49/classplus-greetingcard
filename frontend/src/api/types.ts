export interface ApiResponse<T> {
  success: boolean;
  message: string;
  details: T | null;
  error_code: string | null;
}

export type RegisterResponseType = ApiResponse<{ accessToken: string }>;

export type LoginResponseType = ApiResponse<{ accessToken: string }>;

export type CurrentUserResponseType = ApiResponse<{
  id: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
  plan: "free" | "premium";
  isVerified: boolean;
}>;

export type TemplateType = {
  id: string;
  title: string;
  category:
    | "birthday"
    | "anniversary"
    | "festival"
    | "wedding"
    | "congratulations"
    | "other";
  imageUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  profileSize: number;
};

export type GetAllTemplatesResponseType = ApiResponse<TemplateType[]>;

export type GetTemplateResponseType = ApiResponse<TemplateType>;
