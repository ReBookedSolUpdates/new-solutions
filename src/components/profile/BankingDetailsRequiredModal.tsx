import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useBanking } from "@/hooks/useBanking";
import BankingForm from "@/components/banking/BankingForm";

interface BankingDetailsRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onBankingDetailsAdded: () => void;
}

const BankingDetailsRequiredModal: React.FC<BankingDetailsRequiredModalProps> = ({
  open,
  onClose,
  onBankingDetailsAdded,
}) => {
  const { bankingDetails, isLoading: bankingLoading, refreshBankingDetails } = useBanking();
  const [showBankingForm, setShowBankingForm] = useState(false);

  const hasBankingDetails = !!bankingDetails && bankingDetails.status === "active";

  const handleClose = () => {
    if (hasBankingDetails) {
      onBankingDetailsAdded();
    } else {
      onClose();
    }
  };

  const handleBankingFormSuccess = () => {
    refreshBankingDetails();
    setShowBankingForm(false);
    onBankingDetailsAdded();
  };

  if (bankingLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[88vw] max-w-sm rounded-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (hasBankingDetails) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[88vw] max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Banking Details Confirmed
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                Your banking details are set and verified. Your payout will be sent to your registered account.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                onClick={handleClose}
                className="w-full bg-primary hover:bg-primary/90 rounded-xl"
              >
                Continue to Payout Request
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show banking form inline
  if (showBankingForm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[92vw] max-w-sm sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-primary" />
              Set Up Banking Details
            </DialogTitle>
            <DialogDescription className="text-sm">
              All information is encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>
          <BankingForm
            onSuccess={handleBankingFormSuccess}
            onCancel={() => setShowBankingForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[88vw] max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Banking Details Required
          </DialogTitle>
          <DialogDescription className="text-sm">
            Fill in your banking details below to receive payouts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Alert className="border-primary/20 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              We need your banking information to process your payout. This is a one-time setup.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              Your Data is Safe
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Lock className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Encrypted:</strong> Bank-level security</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Private:</strong> Never stored in plain text</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Control:</strong> Remove details anytime</span>
              </li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={() => setShowBankingForm(true)}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Fill in Banking Details
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankingDetailsRequiredModal;
