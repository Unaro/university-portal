"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface BackButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  label?: string;
  fallbackHref?: string;
}

/**
 * Кнопка "Назад", которая использует историю браузера.
 */
export function BackButton({ 
  label = "Назад", 
  fallbackHref, 
  className, 
  variant = "ghost",
  size,
  ...props 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // В большинстве случаев это сработает. 
    router.back();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      onClick={handleBack}
      type="button"
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
