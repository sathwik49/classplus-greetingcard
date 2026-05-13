import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userRegistrationSchema,
  type UserRegistrationSchematype,
} from "../../validations/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { getMeQuery, registerMutation } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import type { RegisterResponseType } from "../../api/types";
import { baseURL } from "../../api/baseUrl";
import { Loader2, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AUTH_REDIRECT_URL } from "../../api/endPoints";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(userRegistrationSchema) });

  const password = watch("password");
  const { setAccessToken, setUser } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: registerMutation,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: UserRegistrationSchematype) => {
    if (!photo) {
      toast.error("Profile Picture is required");
      return;
    }
    mutate(
      { ...data, photo },
      {
        async onSuccess(res) {
          toast.success("Account created successfully");
          reset();
          setPhoto(null);
          if (!res.details?.accessToken) {
            toast.error("Authentication failed");
            return;
          }
          setAccessToken(res.details?.accessToken);
          const me = await getMeQuery(res.details?.accessToken);
          setUser(me.details);
          navigate(AUTH_REDIRECT_URL);
        },
        onError(error) {
          if (axios.isAxiosError(error)) {
            const res: RegisterResponseType = error.response?.data;
            toast.error(res.message ?? "Something went wrong");
          }
        },
      },
    );
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="bg-white w-full max-w-md p-8 rounded-lg flex flex-col space-y-2 shadow-xl">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-rose-500">GreetingCard</h1>
        <p className="text-sm font-medium text-gray-500">
          Create an account to get started
        </p>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-1 mb-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-rose-300 overflow-hidden bg-gray-100 flex items-center justify-center">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-gray-300 w-7 h-7" />
              )}
            </div>
            <label
              htmlFor="photo"
              className="absolute bottom-0 right-0 bg-rose-500 rounded-full p-1.5 cursor-pointer hover:bg-rose-600 transition"
            >
              <Camera className="h-3 w-3 text-white" />
            </label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-400">Profile photo</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="abc@example.com"
            className="block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block text-gray-700 font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="block w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-4 top-3.5 size-3"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-rose-500 flex items-center justify-center rounded-lg mt-2 text-white cursor-pointer transition duration-200 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-5 w-4 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <button
        onClick={handleGoogleSignIn}
        className="w-full px-4 py-2 rounded-lg mt-2 cursor-pointer flex justify-center items-center gap-3 border hover:bg-gray-200"
      >
        <FcGoogle size={19} />
        <span>Sign Up with Google</span>
      </button>

      <p className="text-center">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="hover:underline text-rose-600 cursor-pointer"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
