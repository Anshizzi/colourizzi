import { motion } from "framer-motion";
import { tv } from "tailwind-variants";

const fluidGlass = tv({
  base: "relative z-10 overflow-hidden rounded-3xl border bg-white/10 p-4 shadow-lg backdrop-blur-md",
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      full: "w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface FluidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "full";
}

export function FluidGlass({ children, className, size, ...props }: FluidGlassProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={fluidGlass({ size, className })}
      {...props}
    >
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-xl opacity-50" />
      {children}
    </motion.div>
  );
}
