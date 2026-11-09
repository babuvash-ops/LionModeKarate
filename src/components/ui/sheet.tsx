import * as React from "react"
import { X } from "lucide-react"

export function Sheet({ open, onOpenChange, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
}

export function SheetContent({ children, side = "right", className = "" }: any) {
  const sideClass = side === "right" ? "right-0" : "left-0";
  return (
    <div className={`fixed inset-y-0 ${sideClass} z-50 h-full w-3/4 max-w-sm border-l bg-background shadow-lg transition-transform ${className}`}>
      {children}
    </div>
  );
}

export function SheetHeader({ children, className = "" }: any) {
  return <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>{children}</div>;
}

export function SheetTitle({ children, className = "" }: any) {
  return <div className={`text-lg font-semibold text-foreground ${className}`}>{children}</div>;
}

export function SheetDescription({ children, className = "" }: any) {
  return <div className={`text-sm text-muted-foreground ${className}`}>{children}</div>;
}
