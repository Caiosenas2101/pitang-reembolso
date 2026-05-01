import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva("rounded-lg border p-4 text-sm", {
  variants: {
    variant: {
      default: "border-border bg-background text-foreground",
      destructive: "border-destructive/50 text-destructive",
      success: "border-emerald-200 bg-emerald-50 text-emerald-900",
      muted: "border-border bg-muted text-muted-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} role="alert" {...props} />;
}
