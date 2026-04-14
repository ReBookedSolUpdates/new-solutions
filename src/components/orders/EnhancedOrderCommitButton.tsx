import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fallbackService } from "@/services/fallbackService";
import PudoLockerSelector from "@/components/checkout/BobGoLockerSelector";
import { BobGoLocation } from "@/services/bobgoLocationsService";

interface EnhancedOrderCommitButtonProps {
  orderId: string;
  sellerId: string;
  bookTitle?: string;
  buyerName?: string;
  orderStatus?: string;
  onCommitSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

const EnhancedOrderCommitButton: React.FC<EnhancedOrderCommitButtonProps> = ({
  orderId,
  sellerId,
  bookTitle = "this book",
  buyerName = "the buyer",
  orderStatus,
  onCommitSuccess,
  disabled = false,
  className = "",
}) => {
  const [isCommitting, setIsCommitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pickupType, setPickupType] = useState<"door" | "locker" | null>(null);
  const [deliveryType, setDeliveryType] = useState<"door" | "locker" | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [sellerHasNoAddress, setSellerHasNoAddress] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<BobGoLocation | null>(null);

  // Load order details to get original pickup and delivery types
  useEffect(() => {
    if (isDialogOpen) {
      fetchOrderDetails();
    }
  }, [isDialogOpen]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoadingOrder(true);

      // Fetch the order to get the original pickup_type and delivery_type
      const { data: order, error } = await supabase
        .from("orders")
        .select("pickup_type, delivery_type, pickup_address_encrypted, seller_id")
        .eq("id", orderId)
        .single();

      if (error) {
        setPickupType("door");
        setDeliveryType("door");
        return;
      }

      if (order) {
        setPickupType((order.pickup_type || "door") as "door" | "locker");
        setDeliveryType((order.delivery_type || "door") as "door" | "locker");

        // Check if seller still has an address (for door pickup)
        if (order.pickup_type === "door" || !order.pickup_type) {
          // Check if pickup address exists on order
          if (!order.pickup_address_encrypted) {
            // Check seller profile for address
            const { data: profile } = await supabase
              .from("profiles")
              .select("pickup_address_encrypted")
              .eq("id", sellerId)
              .single();

            if (!profile?.pickup_address_encrypted) {
              setSellerHasNoAddress(true);
              setPickupType("locker"); // Force locker
            }
          }
        }
      }
    } catch (error) {
      setPickupType("door");
      setDeliveryType("door");
    } finally {
      setIsLoadingOrder(false);
    }
  };

  // Check if order is already committed
  const isAlreadyCommitted =
    orderStatus === "committed" ||
    orderStatus === "courier_scheduled" ||
    orderStatus === "shipped";

  const handleCommit = async () => {
    setIsCommitting(true);
    setIsDialogOpen(false);

    try {
      // Fetch order details for email sending
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          id,
          buyer_id,
          seller_id,
          buyer_email,
          seller_email,
          buyer_full_name,
          seller_full_name,
          items,
          delivery_type,
          pickup_type,
          total_amount
        `)
        .eq("id", orderId)
        .single();

      if (orderError || !orderData) {
        throw new Error("Failed to fetch order details for email sending");
      }

      // Prepare the commit data
      const commitData: Record<string, unknown> = {
        order_id: orderId,
        seller_id: sellerId,
      };

      // If seller has no address, pass the selected locker data
      if (sellerHasNoAddress && selectedLocker) {
        commitData.delivery_method = "locker";
        commitData.locker_data = {
          id: selectedLocker.id,
          name: selectedLocker.name,
          address: selectedLocker.address,
          provider_slug: selectedLocker.provider_slug || "pargo",
        };
      }

      let data, error;

      // Use the basic commit-to-sale function directly
      try {
        const result = await supabase.functions.invoke(
          "commit-to-sale",
          {
            body: commitData,
          },
        );
        data = result.data;
        error = result.error;

      } catch (originalError) {

        // Final fallback to direct database service
        const fallbackResult = await fallbackService.commitToSale({
          order_id: orderId,
          seller_id: sellerId,
        });

        if (fallbackResult.success) {
          data = fallbackResult.data;
          error = null;

          toast.info("Using backup commit mode - your order is being processed.", {
            duration: 5000,
          });
        } else {
          throw new Error(fallbackResult.error || "All commit methods failed");
        }
      }

      if (error) {
        // More specific error handling for edge functions
        let errorMessage = "Failed to call commit function";
        if (error.message?.includes('FunctionsFetchError')) {
          errorMessage = "Edge Function service is temporarily unavailable. Please try again.";
        } else if (error.message?.includes('CORS')) {
          errorMessage = "CORS error - Edge Function configuration issue";
        } else {
          errorMessage = error.message || errorMessage;
        }

        throw new Error(errorMessage);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to commit to sale");
      }

      // Send confirmation emails to buyer and seller
      let emailsSent = false;
      try {
        const deliveryMethodText = orderData.delivery_type === 'locker' ? 'to your selected locker' : 'to your address';
        const pickupMethodText = orderData.pickup_type === 'locker' ? 'from your selected locker' : 'from your address';

        const items = Array.isArray(orderData.items) ? orderData.items : [];
        const bookTitles = items.map((item: any) => item.title || "Book").join(", ");

        // Email to buyer
        const buyerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmed - Pickup Scheduled</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f3fef7; padding: 20px; color: #1f4e3d; margin: 0; }
    .container { max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
    .header { background: #3ab26f; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 20px -30px; }
    .footer { background: #f3fef7; color: #1f4e3d; padding: 20px; text-align: center; font-size: 12px; line-height: 1.5; margin: 30px -30px -30px -30px; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb; }
    .info-box { background: #f3fef7; border: 1px solid #3ab26f; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .link { color: #3ab26f; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
    </div>
    <h2>Great news, ${orderData.buyer_full_name || "Buyer"}!</h2>
    <p><strong>${orderData.seller_full_name || "Seller"}</strong> has confirmed your order and is preparing your book(s) for delivery ${deliveryMethodText}.</p>
    <div class="info-box">
      <h3>📚 Order Details</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Book(s):</strong> ${bookTitles}</p>
      <p><strong>Seller:</strong> ${orderData.seller_full_name || "Seller"}</p>
      <p><strong>Delivery Method:</strong> ${orderData.delivery_type === 'locker' ? 'Locker Delivery' : 'Door-to-Door'}</p>
      <p><strong>Estimated Delivery:</strong> 2-3 business days</p>
      ${data?.tracking_number ? `<p><strong>Tracking Number:</strong> ${data.tracking_number}</p>` : ""}
    </div>
    <p>Happy reading! 📖</p>
    <div class="footer">
      <p><strong>This is an automated message from ReBooked Solutions.</strong><br/>Please do not reply to this email.</p>
      <p>For assistance, contact: <a href="mailto:support@rebookedsolutions.co.za" class="link">support@rebookedsolutions.co.za</a><br/>
      Visit us at: <a href="https://rebookedsolutions.co.za" class="link">https://rebookedsolutions.co.za</a></p>
      <p>T&Cs apply.</p>
      <p><em>"Pre-Loved Pages, New Adventures"</em></p>
    </div>
  </div>
</body>
</html>`;

        // Email to seller
        const sellerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Commitment Confirmed - Prepare for Pickup</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f3fef7; padding: 20px; color: #1f4e3d; margin: 0; }
    .container { max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
    .header { background: #3ab26f; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 20px -30px; }
    .footer { background: #f3fef7; color: #1f4e3d; padding: 20px; text-align: center; font-size: 12px; line-height: 1.5; margin: 30px -30px -30px -30px; border-radius: 0 0 10px 10px; border-top: 1px solid #e5e7eb; }
    .info-box { background: #f3fef7; border: 1px solid #3ab26f; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .link { color: #3ab26f; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Commitment Confirmed!</h1>
    </div>
    <h2>Thank you, ${orderData.seller_full_name || "Seller"}!</h2>
    <p>You've successfully committed to sell your book(s). The buyer has been notified and pickup has been scheduled ${pickupMethodText}.</p>
    <div class="info-box">
      <h3>📋 Order Details</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Book(s):</strong> ${bookTitles}</p>
      <p><strong>Buyer:</strong> ${orderData.buyer_full_name || "Buyer"}</p>
      <p><strong>Pickup Method:</strong> ${orderData.pickup_type === 'locker' ? 'Locker Pickup' : 'Door-to-Door'}</p>
      ${data?.tracking_number ? `<p><strong>Tracking Number:</strong> ${data.tracking_number}</p>` : ""}
    </div>
    <p>${orderData.pickup_type === 'locker' ? 'Please drop off your package at the selected locker location.' : 'A courier will contact you within 24 hours to arrange pickup.'}</p>
    <p>Thank you for selling with ReBooked Solutions! 📚</p>
    <div class="footer">
      <p><strong>This is an automated message from ReBooked Solutions.</strong><br/>Please do not reply to this email.</p>
      <p>For assistance, contact: <a href="mailto:support@rebookedsolutions.co.za" class="link">support@rebookedsolutions.co.za</a><br/>
      Visit us at: <a href="https://rebookedsolutions.co.za" class="link">https://rebookedsolutions.co.za</a></p>
      <p>T&Cs apply.</p>
      <p><em>"Pre-Loved Pages, New Adventures"</em></p>
    </div>
  </div>
</body>
</html>`;

        // Send both emails
        const emailPromises = [];

        if (orderData.buyer_email) {
          emailPromises.push(
            supabase.functions.invoke("send-email", {
              body: {
                to: orderData.buyer_email,
                subject: "Order Confirmed - Pickup Scheduled",
                html: buyerEmailHtml,
              },
            })
          );
        }

        if (orderData.seller_email) {
          emailPromises.push(
            supabase.functions.invoke("send-email", {
              body: {
                to: orderData.seller_email,
                subject: "Order Commitment Confirmed - Prepare for Pickup",
                html: sellerEmailHtml,
              },
            })
          );
        }

        const emailResults = await Promise.all(emailPromises);
        const allEmailsSuccessful = emailResults.every(result => !result.error && result.data?.success);
        emailsSent = allEmailsSuccessful;

        if (!emailsSent) {
          toast.warning("Order committed, but email delivery encountered issues. Please check your inbox.", {
            duration: 7000,
          });
        }
      } catch (emailError) {
        toast.warning("Order committed, but we couldn't send confirmation emails. We'll retry shortly.", {
          duration: 7000,
        });
      }

      // Show success message based on pickup type
      if (pickupType === "locker") {
        toast.success("Order committed! Book will be dropped at locker.", {
          duration: 5000,
        });

        if (emailsSent) {
          toast.info(
            "✅ Confirmation emails sent to you and the buyer.",
            {
              duration: 7000,
            },
          );
        }
      } else {
        toast.success("Order committed! Courier pickup will be scheduled automatically.", {
          duration: 5000,
        });

        if (emailsSent) {
          toast.info(
            "✅ Confirmation emails sent to you and the buyer.",
            {
              duration: 7000,
            },
          );
        }
      }

      // Call success callback
      onCommitSuccess?.();
    } catch (error: unknown) {
      let errorMessage = "Failed to commit to sale";
      const errorObj = error as Error;

      // Handle specific error messages
      if (errorObj.message?.includes("already committed")) {
        errorMessage = "This order has already been committed";
        toast.error(errorMessage, {
          description: "Please refresh the page to see the latest status.",
        });
      } else if (errorObj.message?.includes("not found")) {
        errorMessage = "Order not found or access denied";
        toast.error(errorMessage, {
          description: "Please check if you have permission to commit this order.",
        });
      } else if (errorObj.message?.includes("FunctionsFetchError") || errorObj.message?.includes("Edge Function")) {
        errorMessage = "Service temporarily unavailable";
        toast.error(errorMessage, {
          description: "The commit service is temporarily down. Please try again in a few minutes.",
          duration: 10000,
        });
      } else if (errorObj.message?.includes("Failed to send a request")) {
        errorMessage = "Network connection issue";
        toast.error(errorMessage, {
          description: "Please check your internet connection and try again.",
          duration: 8000,
        });
      } else {
        toast.error(errorMessage, {
          description: errorObj.message || "Please try again or contact support.",
          duration: 8000,
        });
      }
    } finally {
      setIsCommitting(false);
    }
  };

  // If already committed, show status
  if (isAlreadyCommitted) {
    return (
      <Button
        variant="outline"
        disabled
        className={`${className} cursor-not-allowed opacity-70 min-h-[44px] px-3 sm:px-4 text-sm sm:text-base bg-emerald-50 border-emerald-300 text-emerald-700`}
      >
        <CheckCircle className="w-4 h-4 mr-1 sm:mr-2 text-emerald-600 flex-shrink-0" />
        <span className="truncate font-medium">Sale Confirmed</span>
      </Button>
    );
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          disabled={disabled || isCommitting}
          className={`${className} bg-emerald-600 hover:bg-emerald-700 text-white min-h-[44px] px-3 sm:px-4 text-sm sm:text-base font-semibold`}
        >
          {isCommitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin flex-shrink-0" />
              <span className="truncate">Committing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Confirm Sale</span>
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-sm sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-xl sm:text-2xl text-gray-900">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <span>Confirm Sale</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base sm:text-lg mt-2">
            You are about to confirm selling <strong className="text-gray-900">"{bookTitle}"</strong> to <strong className="text-gray-900">{buyerName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-5 mt-6">
          {/* Seller Address Removed Warning + Locker Selector */}
          {sellerHasNoAddress && (
            <Alert className="border-amber-300 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Your pickup address is no longer available.</strong> You must select a locker drop-off location to proceed. A flat shipping rate of R110 will apply.
              </AlertDescription>
            </Alert>
          )}

          {sellerHasNoAddress && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  Select Locker Drop-Off Location
                </h4>
              </div>
              <div className="p-4">
                <PudoLockerSelector
                  onLockerSelect={(locker) => setSelectedLocker(locker)}
                  selectedLockerId={selectedLocker?.id?.toString()}
                  title="Search for a nearby locker"
                  description="Enter your address to find lockers near you"
                  showCardLayout={false}
                />
                {selectedLocker && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Selected: {selectedLocker.name}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">{selectedLocker.address}</p>
                    {selectedLocker.trading_hours && (
                      <div className="mt-2 pt-2 border-t border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Hours</span>
                        <p className="text-xs text-emerald-700 leading-relaxed whitespace-pre-wrap">
                          {selectedLocker.trading_hours}
                        </p>
                      </div>
                    )}
                    {selectedLocker.available_compartment_sizes && selectedLocker.available_compartment_sizes.length > 0 && (
                      <div className="flex flex-col gap-1 mt-3 pt-2 border-t border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Available Sizes</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedLocker.available_compartment_sizes.map((size: string) => (
                            <Badge key={size} variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-emerald-200 text-emerald-700 bg-white/50">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Method Display - Shows the original method */}
          {!sellerHasNoAddress && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  Delivery Method
                </h4>
              </div>
              <div className="p-4">
                {isLoadingOrder ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
                  </div>
                ) : pickupType === "locker" ? (
                  <div className="p-4 border-2 border-indigo-300 bg-indigo-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-indigo-600 text-white flex-shrink-0 mt-0.5">Pickup Method</Badge>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-indigo-600" />
                          Locker Drop-Off
                        </h5>
                        <p className="text-sm text-gray-700 mt-2">
                          The book will be dropped at the designated locker location.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-2 border-blue-300 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-600 text-white flex-shrink-0 mt-0.5">Pickup Method</Badge>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                          <Home className="w-4 h-4 flex-shrink-0 text-blue-600" />
                          Home Pick-Up
                        </h5>
                        <p className="text-sm text-gray-700 mt-2">
                          Our courier will collect the book from your address.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
            <h4 className="font-semibold text-emerald-900 mb-3 text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              What happens next:
            </h4>
            <ul className="text-sm text-emerald-800 space-y-2">
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-emerald-600 font-bold">1</span>
                <span>{sellerHasNoAddress ? "Drop off your parcel at the selected locker" : "Courier pickup will be automatically scheduled"}</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-emerald-600 font-bold">2</span>
                <span>You'll receive pickup details via email within 24 hours</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-emerald-600 font-bold">3</span>
                <span>Payment will be processed once delivery is confirmed</span>
              </li>
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-rose-800">
                <strong className="text-rose-900 block mb-1">Important Commitment</strong>
                <p>Once you confirm, you are obligated to fulfill this order. Failure to complete pickup may result in penalties and affect your seller rating.</p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-3 sm:gap-2">
          <AlertDialogCancel
            disabled={isCommitting}
            className="w-full sm:w-auto text-sm sm:text-base min-h-[44px] font-medium"
          >
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCommit}
            disabled={isCommitting || isLoadingOrder || (sellerHasNoAddress && !selectedLocker)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base min-h-[44px] font-semibold disabled:opacity-50"
          >
            {isCommitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {sellerHasNoAddress && !selectedLocker ? "Select a Locker First" : "Yes, Confirm Sale"}
                </span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EnhancedOrderCommitButton;
