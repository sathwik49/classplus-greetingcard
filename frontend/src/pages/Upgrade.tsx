import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function UpgradePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDemoPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (user) {
        setUser({ ...user, plan: "premium" });
      }

      toast.success("Welcome to Pro! All templates unlocked.");
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-rose-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
          <p className="text-rose-100 mt-2">
            Unlock unlimited premium greeting cards
          </p>
        </div>

        <div className="p-8">
          <div className="space-y-4 mb-8">
            {[
              "Access all Premium templates",
              "Remove watermarks (if any)",
              "High-resolution exports",
              "Priority support",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total amount</p>
              <p className="text-2xl font-bold text-gray-800">
                $9.99{" "}
                <span className="text-sm font-normal text-gray-400">
                  / lifetime
                </span>
              </p>
            </div>
            <div className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded font-bold uppercase">
              Demo Mode
            </div>
          </div>

          <button
            onClick={handleDemoPayment}
            disabled={isProcessing}
            className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Demo Payment"
            )}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600 transition"
          >
            Cancel and go back
          </button>
        </div>
      </div>
    </div>
  );
}
