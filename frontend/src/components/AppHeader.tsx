import { Link, useNavigate } from "react-router-dom";
import { Crown, User } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { logOutMutation } from "../api/api";

export default function AppHeader() {
  const navigate = useNavigate();
  const { user, setAccessToken, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logOutMutation();

      setAccessToken(null);

      setUser(null);

      toast.success("Logged out successfully");

      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-xl font-bold text-rose-500"
        >
          GreetingCard
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 overflow-hidden flex items-center justify-center">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-rose-400" />
                )}
              </div>

              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>

                {user.plan === "premium" ? (
                  <span className="text-xs text-amber-500 flex items-center gap-1 font-medium">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Free Plan</span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-rose-100/40 hover:bg-rose-100 text-sm font-medium transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/sign-in"
              className="px-4 py-1.5 text-sm font-medium text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
            >
              Login
            </Link>

            <Link
              to="/sign-up"
              className="px-4 py-1.5 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
