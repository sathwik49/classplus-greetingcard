import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import { ArrowLeft, Loader2, Share2, Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getTemplateByIdQuery } from "../api/api";
import AppHeader from "../components/AppHeader";
import toast from "react-hot-toast";

export default function CardPreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplateByIdQuery(id!),
    enabled: !!id,
  });

  const template = data?.details;
  const isPremiumLocked = template?.isPremium && user?.plan !== "premium";

  const reducedProfileSize = template
    ? Math.round(template.profileSize * 0.6)
    : 50;

  const handleShare = async () => {
    if (isPremiumLocked) {
      toast.error("Upgrade to Pro to share this premium template");
      navigate("/upgrade");
      return;
    }

    if (!cardRef.current) return;

    const loadingToast = toast.loading("Generating card...");

    try {
      const images = cardRef.current.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map(async (img) => {
          if (img.complete) return img.decode().catch(() => {});
          return new Promise((resolve) => {
            img.onload = () => img.decode().then(resolve).catch(resolve);
            img.onerror = resolve;
          });
        }),
      );

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: false,
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("capture-area");
          if (el) {
            el.style.backgroundColor = "#ffffff";
            el.style.color = "#1f2937";
          }
        },
      });

      toast.dismiss(loadingToast);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `card-${id}.png`, { type: "image/png" });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "My Greeting Card",
              text: "Check out this card I created!",
            });
            return;
          } catch (e) {
            if ((e as DOMException).name === "AbortError") return;
          }
        }
        if (navigator.share) {
          try {
            await navigator.share({
              title: "My Greeting Card",
              text: "Check out this greeting card I made!",
              url: window.location.href,
            });
            return;
          } catch (e) {
            if ((e as DOMException).name === "AbortError") return;
          }
        }
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch {
          toast.error("Sharing not supported on this browser.");
        }
      }, "image/png");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Export failed. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-500" />
      </div>
    );

  if (!template)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 cursor-pointer"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleShare}
            className={`${
              isPremiumLocked ? "bg-amber-500" : "bg-rose-500"
            } text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg cursor-pointer`}
          >
            {isPremiumLocked ? <Crown size={18} /> : <Share2 size={18} />}
            {isPremiumLocked ? "Unlock to Share" : "Share"}
          </button>
        </div>

        <div className="flex justify-center">
          <div
            id="capture-area"
            ref={cardRef}
            style={{
              width: "480px",
              borderRadius: "24px",
              backgroundColor: "#ffffff",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="shadow-2xl"
          >
            <h2
              style={{ color: "#1f2937", marginBottom: "24px" }}
              className="font-bold text-2xl text-center"
            >
              {user?.name}
            </h2>

            <div
              className="relative w-full"
              style={{ borderRadius: "12px", marginBottom: "16px" }}
            >
              <img
                src={template.imageUrl}
                crossOrigin="anonymous"
                style={{ borderRadius: "12px", width: "100%", height: "auto" }}
                alt="Template"
              />

              {user?.photoUrl && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: `-${reducedProfileSize / 3}px`,
                    width: `${reducedProfileSize}px`,
                    height: `${reducedProfileSize}px`,
                    borderRadius: "50%",
                    border: "4px solid #ffffff",
                    overflow: "hidden",
                    zIndex: 20,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={user.photoUrl}
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="User"
                  />
                </div>
              )}
            </div>

            <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "8px" }}>
              Made with GreetingApp
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
