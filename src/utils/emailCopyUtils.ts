import { toast } from "sonner";

export const copyEmailToClipboard = async (email: string) => {
  try {
    await navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  } catch {
    toast.error("Failed to copy email");
  }
};
