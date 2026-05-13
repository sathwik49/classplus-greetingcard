import type { UserLoginSchematype } from "../validations/auth.validation";
import { axiosClient } from "./axios";
import { endPoints } from "./endPoints";
import type {
  CurrentUserResponseType,
  GetAllTemplatesResponseType,
  GetTemplateResponseType,
  LoginResponseType,
  RegisterResponseType,
} from "./types";

export const registerMutation = async (data: {
  name: string;
  email: string;
  password: string;
  photo?: File | null;
}): Promise<RegisterResponseType> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.photo) formData.append("profile_image", data.photo);

  const res = await axiosClient.post(endPoints.AUTH.REGISTER, formData);
  return res.data;
};

export const loginMutation = async (
  data: UserLoginSchematype,
): Promise<LoginResponseType> => {
  const res = await axiosClient.post(endPoints.AUTH.LOGIN, data);
  return res.data;
};

export const getMeQuery = async (
  accessToken: string,
): Promise<CurrentUserResponseType> => {
  const res = await axiosClient.get(endPoints.USER.ME, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getAllTemplatesQuery = async (
  category?: string,
): Promise<GetAllTemplatesResponseType> => {
  const res = await axiosClient.get(
    `${endPoints.TEMPLATES.ALL}?category=${category}`,
  );
  return res.data;
};

export const getTemplateByIdQuery = async (
  id: string,
): Promise<GetTemplateResponseType> => {
  const res = await axiosClient.get(endPoints.TEMPLATES.BY_ID(id));
  return res.data;
};

export const logOutMutation = async () => {
  const res = await axiosClient.post(endPoints.AUTH.LOGOUT);
  return res.data;
};
