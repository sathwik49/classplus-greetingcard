import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Crown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getAllTemplatesQuery } from "../api/api";
import { queryKeys } from "../api/queryKeys";
import AppHeader from "../components/AppHeader";

const CATEGORIES = [
  "all",
  "birthday",
  "anniversary",
  "festival",
  "wedding",
  "congratulations",
  "other",
];

export default function Home() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState("all");

  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.GET_ALL_TEMPLATES(activeCategory),

    queryFn: () => getAllTemplatesQuery(activeCategory),
  });

  const templates = data?.details ?? [];

  const handleTemplateClick = (template: (typeof templates)[0]) => {
    if (!user) {
      toast.error("Please login first");

      navigate("/sign-in");

      return;
    }

    if (template.isPremium && user.plan === "free") {
      setShowPremiumModal(true);

      return;
    }

    navigate(`/card/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Templates</h2>

          <p className="text-sm text-gray-500 mt-1">
            Pick a template and personalize it instantly
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-500"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-gray-700">
              Failed to load templates
            </p>

            <p className="text-sm text-gray-400 mt-1">Please try again later</p>
          </div>
        )}
        {!isLoading && !isError && templates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500">No templates found</p>
          </div>
        )}

        {!isLoading && !isError && templates.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group bg-white shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={template.thumbnailUrl}
                  alt={template.title}
                  loading="lazy"
                  className="w-full aspect-4/5 object-cover group-hover:scale-105 transition duration-300"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                {template.isPremium && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Pro
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {template.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>

            <h3 className="text-lg font-bold text-center text-gray-800">
              Premium Template
            </h3>
            <p className="text-sm text-gray-500 text-center mt-2 mb-5">
              Upgrade to unlock premium greeting cards
            </p>

            <div className="space-y-2">
              <button
                onClick={() => navigate("/upgrade")}
                className="w-full py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 font-bold transition"
              >
                Upgrade Now
              </button>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
