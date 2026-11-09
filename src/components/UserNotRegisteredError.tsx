import { Link } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import GoldButton from "./shared/GoldButton";
import { useAuth } from "@/lib/AuthContext";
import DojoLogo from "./shared/DojoLogo";

export default function UserNotRegisteredError() {
  const { openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <DojoLogo size="xl" layout="vertical" glowing />
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white">
            Warrior Passport Not Found
          </h2>
          <p className="text-sm text-white/60 mt-2 font-body leading-relaxed">
            Your Google account is recognized, but has not yet been registered in our student roll. You can explore our public dojo features or sign in to register.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => openAuthModal('Register or verify your Google account for Dojo OS')}
            className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Google</span>
          </button>

          <Link to="/" className="block">
            <GoldButton variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Website
            </GoldButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
