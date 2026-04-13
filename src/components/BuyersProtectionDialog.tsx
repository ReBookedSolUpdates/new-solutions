import React from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import "./BuyersProtectionDialog.css";

interface BuyersProtectionDialogProps {
  triggerClassName?: string;
  triggerVariant?: "link" | "ghost" | "secondary" | "outline" | "default" | "destructive";
  triggerLabel?: string;
  triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  triggerType?: "button" | "banner";
}

const BuyersProtectionDialog = ({
  triggerClassName,
  triggerVariant = "outline",
  triggerLabel = "Buyer Protection",
  triggerProps,
  triggerType = "button",
}: BuyersProtectionDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerType === "banner" ? (
          <button
            type="button"
            {...(triggerProps as any)}
            className={cn(
              "w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3 hover:bg-green-100 transition-colors",
              triggerClassName,
            )}
            aria-label={triggerLabel}
          >
            <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-gray-900">{triggerLabel}</div>
              <div className="text-xs text-gray-600">Applied to all purchases</div>
            </div>
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Button
            variant={triggerVariant}
            size="sm"
            className={cn("rounded-md px-3 py-1 gap-2", triggerClassName)}
            {...triggerProps}
          >
            <ShieldCheck className="h-4 w-4" />
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-2 sm:p-6 w-[calc(100vw-1rem)] sm:w-full max-w-xs sm:max-w-2xl max-h-[85vh] sm:max-h-[85vh] overflow-y-auto mx-auto buyers-protection-dialog">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-xl">
            <ShieldCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
            <span>Buyer Protection</span>
          </DialogTitle>
          <DialogDescription className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
            Every purchase on ReBooked Solutions is protected. Our Buyer Protection kicks in at checkout—so you're covered from start to finish.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Scam Prevention Section */}
          <div className="pb-3 border-b">
            <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-base flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
              Scam Prevention
            </h3>
            <p className="text-[11px] sm:text-sm text-gray-700">Your money is first safely deposited to ReBooked Solutions account, and only released to the Seller once you have confirmed receiving the item.</p>
          </div>

          {/* Return & Refund Policy Section */}
          <div className="pb-3 border-b">
            <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-base flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              Return &amp; Refund Policy
            </h3>
            <p className="text-[11px] sm:text-sm text-gray-700">You have the right to return an item in case it differs significantly from the description. You will be refunded in full if the Seller never ships the item.</p>
          </div>

          {/* Customer Support Section */}
          <div className="pb-3 border-b">
            <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-base flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              Customer Support
            </h3>
            <p className="text-[11px] sm:text-sm text-gray-700">We have a dedicated team that is just a few clicks away if you ever need any help with your order.</p>
          </div>

          {/* Secure Payments Section */}
          <div className="pb-3 border-b">
            <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-base flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              Secure Payments
            </h3>
            <p className="text-[11px] sm:text-sm text-gray-700">Payments are encrypted by our integrated payment partners, so your money is always handled safely.</p>
          </div>

          {/* Info Section */}
          <div className="space-y-2 text-[11px] sm:text-sm text-gray-600">
            <p className="text-center"><span className="font-medium text-green-900">R20 Buyers Protection Fee</span>, a small fee per purchase covers payment processing, buyer protection, and support—so you're fully covered.</p>
            <p className="text-center">Having payment issues? Email <a href="mailto:info@rebookedsolutions.co.za" className="font-medium text-blue-600 hover:underline">info@rebookedsolutions.co.za</a></p>
            <p className="text-center">
              Need more help?{" "}
              <a
                href="https://support.rebookedsolutions.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-700 hover:underline"
              >
                Visit our Support Portal →
              </a>
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-3 border-t">
          <DialogClose asChild>
            <Button variant="outline" className="w-full text-xs sm:text-sm py-2 sm:py-2.5">
              I Understand
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyersProtectionDialog;
