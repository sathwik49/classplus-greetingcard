import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userLoginSchema,
  type UserLoginSchematype,
} from "../../validations/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { getMeQuery, loginMutation } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import type { LoginResponseType } from "../../api/types";
import { baseURL } from "../../api/baseUrl";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AUTH_REDIRECT_URL } from "../../api/endPoints";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(userLoginSchema) });

  const password = watch("password");

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: loginMutation,
  });

  const onSubmit = (data: UserLoginSchematype) => {
    mutate(data, {
      async onSuccess(res) {
        toast.success("Account created successfully");
        reset();
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
          const res: LoginResponseType = error.response?.data;
          toast.error(res.message ?? "Something went wrong");
        }
      },
    });
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="bg-white w-full max-w-md p-8 rounded-lg flex flex-col space-y-2 shadow-xl">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-rose-500">GreetingCard</h1>
        <p className="text-sm font-medium text-gray-500">Welcome Back</p>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
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
          {isPending ? <Loader2 className="h-5 w-4 animate-spin" /> : "Sign In"}
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
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="hover:underline text-rose-600 cursor-pointer"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
