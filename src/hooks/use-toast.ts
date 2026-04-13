import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastEntry {
  id: string;
  title?: string;
  description?: string;
  action?: any;
  [key: string]: any;
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      });
    } else {
      sonnerToast.success(title, {
        description,
      });
    }
  };

  // Provide empty toasts array for backward compatibility with Toaster component
  const toasts: ToastEntry[] = [];

  return { toast, toasts };
}

export const toast = sonnerToast;
