"use client";

import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyListProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyList({
  message = "Nenhum item encontrado",
  icon,
  className,
  children,
}: EmptyListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-background rounded-lg border dark:border-border border-gray-100 shadow-sm",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative mb-4"
      >
        {icon || (
          <Box className="h-20 w-20 text-muted-foreground/40 stroke-[1.25]" />
        )}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gray-200/30 blur-xl"
          style={{ zIndex: -1 }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-base font-medium text-muted-foreground text-center max-w-xs"
      >
        {message}
      </motion.p>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
