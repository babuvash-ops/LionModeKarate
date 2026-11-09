import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import DojoLogo from "@/components/shared/DojoLogo";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background md:pl-64">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="md:hidden sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 py-2.5 flex justify-between items-center shadow-lg">
        <DojoLogo size="sm" href="/" />
        <button 
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground border border-border"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
      </div>
      <Outlet />
    </div>
  );
}
