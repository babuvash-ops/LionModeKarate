import { ButtonHTMLAttributes, ReactNode, MouseEventHandler } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function GoldButton({
  variant = "solid",
  size = "md",
  className,
  children,
  isLoading,
  disabled,
  ...props
}: GoldButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base md:text-lg",
  };

  const variants = {
    solid: "bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100",
    outline: "bg-transparent border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary active:scale-95 disabled:opacity-50 disabled:active:scale-100",
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200 gap-2 font-heading tracking-wider uppercase disabled:cursor-not-allowed",
        sizeClasses[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
