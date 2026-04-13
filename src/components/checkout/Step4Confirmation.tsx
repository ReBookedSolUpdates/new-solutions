import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Truck,
  Download,
  Mail,
  Eye,
  ShoppingBag,
  Loader2,
  User,
  CreditCard,
  MapPin,
  BookOpen,
  Hash,
  GraduationCap,
  Globe,
  Layers,
  Tag,
} from "lucide-react";
import { OrderConfirmation } from "@/types/checkout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Step4ConfirmationProps {
  orderData: OrderConfirmation;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

interface BuyerProfile {
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
}

const Row: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0 gap-3">
      <span className="text-xs sm:text-sm text-gray-500 font-semibold min-w-0 shrink-0">{label}</span>
      <span className="text-xs sm:text-sm text-gray-800 font-medium text-right break-words max-w-[65%]">{value}</span>
    </div>
  );
};

const SectionHeader: React.FC<{ emoji: string; title: string; icon: React.ReactNode }> = ({ emoji, title, icon }) => (
  <h3 className="font-bold text-sm uppercase text-gray-700 flex items-center gap-2 mb-3">
    {icon}
    {emoji} {title}
  </h3>
);

const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({
  orderData,
  onViewOrders,
  onContinueShopping,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);

  useEffect(() => {
    // Fetch buyer profile for full details
    const fetchBuyer = async () => {
      if (!orderData.buyer_id) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, first_name, last_name, email, phone_number')
        .eq('id', orderData.buyer_id)
        .single();
      if (data) setBuyerProfile(data as BuyerProfile);
    };

    fetchBuyer();

    // Cleanup cart
    localStorage.removeItem('checkoutCart');
    localStorage.removeItem('activeCheckoutKey');

    toast.success("Payment successful! 🎉", {
      description: "Your order has been confirmed and the seller has been notified.",
      duration: 5000,
    });
  }, [orderData.buyer_id]);

  const buyerName = buyerProfile
    ? buyerProfile.full_name || `${buyerProfile.first_name || ''} ${buyerProfile.last_name || ''}`.trim()
    : orderData.buyer_id;

  const deliveryDisplayName = orderData.delivery_method?.toLowerCase().includes('locker')
    ? 'Locker-to-Locker'
    : orderData.delivery_method?.toLowerCase().includes('door') || orderData.delivery_method?.toLowerCase().includes('home')
    ? 'Door-to-Door'
    : orderData.delivery_method || 'Standard Delivery';

  const book = orderData.book as any;

  // ── PDF Generation ──────────────────────────────────────────
  const downloadReceipt = async () => {
    if (!receiptRef.current) {
      toast.error("Receipt element not found");
      return;
    }
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Handle multi-page if receipt is long
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      pdf.save(`receipt-${orderData.order_id}.pdf`);
      toast.success("Receipt PDF downloaded!");

      // Save receipt HTML to orders table (fire-and-forget)
      if (receiptRef.current && orderData.order_id) {
        const receiptHtml = receiptRef.current.innerHTML;
        supabase
          .from('orders')
          .update({ receipt_html: receiptHtml } as any)
          .eq('id', orderData.id)
          .then(({ error }: { error: any }) => {
            if (error) console.error('[Step4] Failed to save receipt HTML:', error);
          });
      }
    } catch (err) {
      console.error("[Step4] PDF generation error:", err);
      toast.error("Failed to generate PDF receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-3 sm:px-0">
      {/* ── Success Header ── */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Payment Successful! 🎉</h1>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been confirmed and the seller has been notified.
        </p>
      </div>

      {/* ── Order Details Card (visible on screen) ── */}
      <Card className="border-l-4 border-l-green-500 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="w-5 h-5 text-green-600" />
            Order Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Order ID", value: orderData.order_id, mono: true },
              { label: "Ref", value: orderData.payment_reference, mono: true },
              { label: "Date", value: new Date(orderData.created_at).toLocaleDateString() },
              { label: "Status", value: "✅ PAID" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">{item.label}</p>
                <p className={`text-sm font-bold mt-1 truncate ${item.mono ? "font-mono text-xs" : ""}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Item Details */}
          <div>
            <SectionHeader emoji="📦" title="Item Details" icon={<Package className="w-4 h-4" />} />
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="font-bold text-base text-gray-900 mb-2">{orderData.book_title}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Row label="Author" value={orderData.book_author} />
                <Row label="Condition" value={orderData.book_condition} />
                <Row label="Category" value={book?.category} />
                <Row label="ISBN" value={book?.isbn} />
                <Row label="Publisher" value={book?.publisher} />
                <Row label="Language" value={book?.language} />
                <Row label="Curriculum" value={book?.curriculum} />
                <Row label="Grade / Year" value={book?.grade || book?.universityYear} />
                <Row label="School Name" value={book?.school_name} />
                <Row label="Gender" value={book?.gender} />
                <Row label="Size" value={book?.size} />
                <Row label="Color" value={book?.color} />
                <Row label="Subject" value={book?.subject} />
                <Row label="Item Type" value={book?.itemType || book?.item_type} />
                <Row label="Province" value={book?.province} />
                <Row label="Item ID" value={orderData.book_id} />
              </div>
              {orderData.book_description && (
                <p className="text-xs text-gray-600 mt-3 border-t border-blue-200 pt-3 leading-relaxed">
                  <span className="font-bold text-gray-500 uppercase block mb-1">Description:</span>
                  {orderData.book_description}
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between">
                <span className="text-sm font-semibold text-gray-700 uppercase">Item Amount</span>
                <span className="text-base font-bold text-green-600">R{Number(orderData.book_price).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div>
            <SectionHeader emoji="👤" title="Seller Information" icon={<User className="w-4 h-4" />} />
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              {orderData.seller_name && (
                <p className="font-semibold text-gray-900 mb-2">{orderData.seller_name}</p>
              )}
              <p className="text-xs text-gray-500">Seller ID: <span className="font-mono">{orderData.seller_id}</span></p>
              <p className="text-sm text-gray-600 mt-2">
                The seller has been notified and will prepare your item for shipment.
              </p>
            </div>
          </div>

          {/* Buyer Info */}
          <div>
            <SectionHeader emoji="🧑" title="Buyer Information" icon={<User className="w-4 h-4" />} />
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="space-y-0">
                <Row label="Name" value={buyerName || undefined} />
                <Row label="Email" value={buyerProfile?.email || undefined} />
                <Row label="Phone" value={buyerProfile?.phone_number || undefined} />
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div>
            <SectionHeader emoji="🚚" title="Delivery Method" icon={<Truck className="w-4 h-4" />} />
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{deliveryDisplayName}</p>
                  {orderData.delivery_method === 'locker' && (
                    <p className="text-xs text-gray-500 mt-1">BobGo Locker Network</p>
                  )}
                  {orderData.delivery_method === 'door' && (
                    <p className="text-xs text-gray-500 mt-1">Home Delivery — The Courier Guy</p>
                  )}
                </div>
                <span className="text-base font-bold text-gray-800">
                  R{Number(orderData.delivery_price).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">You'll receive tracking info once the item is shipped.</p>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div>
            <SectionHeader emoji="💰" title="Price Breakdown" icon={<CreditCard className="w-4 h-4" />} />
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Price</span>
                <span>R{Number(orderData.book_price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>R{Number(orderData.delivery_price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buyer's Protection Fee</span>
                <span>R{Number(orderData.platform_fee || 20).toFixed(2)}</span>
              </div>
              {orderData.coupon_discount && Number(orderData.coupon_discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-R{Number(orderData.coupon_discount).toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span className="text-green-600">R{Number(orderData.total_paid).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800">PAID — Payment Completed Successfully</p>
              <p className="text-xs text-green-700">
                {new Date(orderData.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Next Steps ── */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Confirmation email sent to your registered email address</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Package className="w-4 h-4 text-orange-500" />
            <span>Seller will be notified to prepare your item for shipment</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Truck className="w-4 h-4 text-green-500" />
            <span>You'll receive tracking information via email once shipped</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Action Buttons ── */}
      <div className="space-y-3 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={downloadReceipt}
            disabled={isDownloading}
            variant="outline"
            className="py-3 font-semibold"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Receipt (PDF)
              </>
            )}
          </Button>
          <Button onClick={onViewOrders} variant="outline" className="py-3 font-semibold">
            <Eye className="w-4 h-4 mr-2" />
            View My Orders
          </Button>
        </div>

        <Button
          onClick={onContinueShopping}
          className="w-full py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Continue Shopping
        </Button>
      </div>

      {/* ── Support Info ── */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600">
            Contact us at{" "}
            <a href="mailto:support@rebookedsolutions.co.za" className="text-blue-600 underline">
              support@rebookedsolutions.co.za
            </a>{" "}
            or check your order status in <strong>My Orders</strong>.
          </p>
        </CardContent>
      </Card>

      {/* ── Hidden Receipt Div for PDF Generation ── */}
      <div
        ref={receiptRef}
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "800px",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          color: "#1f4e3d",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Receipt Header */}
        <div style={{ background: "linear-gradient(135deg, #3ab26f, #2d8f58)", padding: "30px 40px", borderRadius: "10px 10px 0 0", textAlign: "center", color: "white", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>ReBooked Solutions</h1>
          <p style={{ margin: "8px 0 0", fontSize: "16px", opacity: 0.9 }}>Purchase Receipt</p>
          <p style={{ margin: "5px 0 0", fontSize: "13px", opacity: 0.8, fontStyle: "italic" }}>"Pre-Loved Pages, New Adventures"</p>
        </div>

        {/* Order Meta */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "25px", fontSize: "13px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px 5px", color: "#6b7280", fontWeight: 600 }}>Order ID</td>
              <td style={{ padding: "8px 5px", fontFamily: "monospace", fontWeight: "bold" }}>{orderData.order_id}</td>
              <td style={{ padding: "8px 5px", color: "#6b7280", fontWeight: 600 }}>Payment Ref</td>
              <td style={{ padding: "8px 5px", fontFamily: "monospace" }}>{orderData.payment_reference}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 5px", color: "#6b7280", fontWeight: 600 }}>Date</td>
              <td style={{ padding: "8px 5px" }}>{new Date(orderData.created_at).toLocaleString()}</td>
              <td style={{ padding: "8px 5px", color: "#6b7280", fontWeight: 600 }}>Status</td>
              <td style={{ padding: "8px 5px", fontWeight: "bold", color: "#16a34a" }}>✅ PAID</td>
            </tr>
          </tbody>
        </table>

        <hr style={{ border: "none", borderTop: "2px solid #3ab26f", marginBottom: "25px" }} />

        {/* Item Details */}
        <div style={{ background: "#f3fef7", border: "1px solid #3ab26f", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1f4e3d" }}>📦 Item Details</h2>
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: "16px" }}>{orderData.book_title}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <tbody>
                {[
                  ["Author", orderData.book_author],
                  ["Condition", orderData.book_condition],
                  ["Category", book?.category],
                  ["ISBN", book?.isbn],
                  ["Publisher", book?.publisher],
                  ["Language", book?.language],
                  ["Curriculum", book?.curriculum],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <tr key={String(label)}>
                    <td style={{ padding: "4px 0", color: "#6b7280", fontWeight: 600, width: "40%" }}>{label}</td>
                    <td style={{ padding: "4px 0" }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <tbody>
                {[
                  ["Grade / Year", book?.grade || book?.universityYear],
                  ["School Name", book?.school_name],
                  ["Gender", book?.gender],
                  ["Size", book?.size],
                  ["Color", book?.color],
                  ["Subject", book?.subject],
                  ["Province", book?.province],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <tr key={String(label)}>
                    <td style={{ padding: "4px 0", color: "#6b7280", fontWeight: 600, width: "45%" }}>{label}</td>
                    <td style={{ padding: "4px 0" }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orderData.book_description && (
            <p style={{ margin: "12px 0 0 0", fontSize: "11px", color: "#4e7a63", paddingTop: "12px", borderTop: "1px solid #d1fae5", fontStyle: "italic" }}>
              <strong>Description:</strong> {orderData.book_description}
            </p>
          )}
        </div>

        {/* Buyer Info */}
        <div style={{ background: "#f0fdf4", border: "1px solid #10b981", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1f4e3d" }}>🧑 Buyer Information</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <tbody>
              {[
                ["Name", buyerName],
                ["Email", buyerProfile?.email],
                ["Phone", buyerProfile?.phone_number],
              ].filter(([, v]) => v).map(([label, val]) => (
                <tr key={String(label)}>
                  <td style={{ padding: "5px 0", color: "#6b7280", fontWeight: 600, width: "35%" }}>{label}</td>
                  <td style={{ padding: "5px 0" }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delivery & Price */}
        <div style={{ background: "#f3fef7", border: "1px solid #3ab26f", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1f4e3d" }}>🚚 Delivery & Pricing</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "6px 0", color: "#6b7280", fontWeight: 600 }}>Delivery Method</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>{deliveryDisplayName}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: "#6b7280", fontWeight: 600 }}>Item Price</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>R{Number(orderData.book_price).toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: "#6b7280", fontWeight: 600 }}>Delivery Fee</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>R{Number(orderData.delivery_price).toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: "#6b7280", fontWeight: 600 }}>Buyer's Protection Fee</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>R{Number(orderData.platform_fee || 20).toFixed(2)}</td>
              </tr>
              {orderData.coupon_discount && Number(orderData.coupon_discount) > 0 && (
                <tr>
                  <td style={{ padding: "6px 0", color: "#16a34a", fontWeight: 600 }}>Coupon Discount</td>
                  <td style={{ padding: "6px 0", textAlign: "right", color: "#16a34a" }}>-R{Number(orderData.coupon_discount).toFixed(2)}</td>
                </tr>
              )}
              <tr style={{ borderTop: "2px solid #3ab26f" }}>
                <td style={{ padding: "10px 0", fontWeight: "bold", fontSize: "16px" }}>Total Paid</td>
                <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold", fontSize: "16px", color: "#3ab26f" }}>
                  R{Number(orderData.total_paid).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "2px solid #3ab26f", fontSize: "12px", color: "#4e7a63" }}>
          <p style={{ margin: "5px 0", fontWeight: "bold", color: "#3ab26f" }}>ReBooked Solutions</p>
          <p style={{ margin: "5px 0" }}>support@rebookedsolutions.co.za | rebookedsolutions.co.za</p>
          <p style={{ margin: "5px 0", fontStyle: "italic" }}>"Pre-Loved Pages, New Adventures"</p>
          <p style={{ margin: "10px 0 0", fontSize: "11px", color: "#9ca3af" }}>
            This is an automated receipt. Please do not reply to this document. © {new Date().getFullYear()} ReBooked Solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step4Confirmation;
