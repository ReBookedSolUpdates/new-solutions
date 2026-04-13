import React from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckoutBook } from "@/types/checkout";
import { supabase } from "@/integrations/supabase/client";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityService } from "@/services/activityService";
import debugLogger from "@/utils/debugLogger";

interface CartCheckoutData {
  items: any[];
  sellerId: string;
  sellerName: string;
  totalPrice: number;
  timestamp: number;
  cartType?: string;
}

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const [book, setBook] = useState<CheckoutBook | null>(null);
  const [cartData, setCartData] = useState<CartCheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutStartedTracked, setCheckoutStartedTracked] = useState(false);

  useEffect(() => {
    // Reset state when component mounts/changes
    setBook(null);
    setCartData(null);
    setError(null);

    // Handle cart checkout vs single book checkout
    const isCartCheckout = location.pathname === '/checkout-cart' || id === "cart";

    if (isCartCheckout) {
      const timestamp = searchParams.get('t');
      loadCartData();
      return;
    }

    if (!id) {
      setError("No book ID provided");
      setLoading(false);
      return;
    }

    loadBookData();
  }, [id, navigate, searchParams]);

  // Add additional effect to refresh cart data when localStorage changes
  useEffect(() => {
    const isCartCheckout = location.pathname === '/checkout-cart' || id === "cart";

    if (isCartCheckout) {
      const handleStorageChange = () => {

        loadCartData();
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [id, location.pathname]);

  // Track checkout started when book is loaded
  useEffect(() => {
    if (book && !checkoutStartedTracked && user) {
      setCheckoutStartedTracked(true);
      const cartValue = book.price;
      // Track checkout started (non-blocking)
      try {
        ActivityService.trackCheckoutStarted(user.id, cartValue, 1);
      } catch (trackingError) {
        debugLogger.error("Checkout", "Error tracking checkout started:", trackingError);
      }
    }
  }, [book, checkoutStartedTracked, user]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get cart data from localStorage - use the most recent one
      const cartDataStr = localStorage.getItem('checkoutCart');

      if (!cartDataStr) {
        setError("No cart data found. Please return to your cart and try again.");
        setLoading(false);
        return;
      }

      const parsedCartData: CartCheckoutData = JSON.parse(cartDataStr);

      // Validate cart data is recent (within 1 hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      if (parsedCartData.timestamp < oneHourAgo) {
        setError("Cart session expired. Please return to your cart and try again.");
        setLoading(false);
        return;
      }

      if (!parsedCartData.items || parsedCartData.items.length === 0) {
        setError("Cart is empty. Please add items to your cart.");
        setLoading(false);
        return;
      }

      setCartData(parsedCartData);

      // Create a CheckoutBook from the first cart item but with cart totals
      const firstItem = parsedCartData.items[0];

      // Create a CheckoutBook that represents the entire cart
      const checkoutBook: CheckoutBook = {
        id: firstItem.bookId,
        title: parsedCartData.items.length > 1
          ? `${parsedCartData.items.length} Books from ${parsedCartData.sellerName}`
          : firstItem.title,
        author: parsedCartData.items.length > 1
          ? "Multiple Authors"
          : firstItem.author,
        price: parsedCartData.totalPrice, // Use total price of all items
        condition: "Various", // Multiple books may have different conditions
        image_url: firstItem.imageUrl || firstItem.image_url || "/placeholder.svg", // Include image from first item
        seller_id: parsedCartData.sellerId,
        seller_name: parsedCartData.sellerName,
        seller: {
          id: parsedCartData.sellerId,
          name: parsedCartData.sellerName,
          email: "",
          hasAddress: true,
          hasSubaccount: true,
          isReadyForOrders: true,
        },
        rawDetails: {
          ...firstItem,
        },
      };

      setBook(checkoutBook);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError("Failed to load cart data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadBookData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id || id.trim() === "") {
        throw new Error("Invalid item ID");
      }

      // Extract UUID part from ID (remove any timestamp suffixes)
      const uuidPart = id.split('-').slice(0, 5).join('-');

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuidPart)) {
        throw new Error("Invalid item ID format. Please check the link and try again.");
      }

      const { getBookById } = await import("@/services/book/bookQueries");
      const bookData = await getBookById(uuidPart);

      if (!bookData) {
        throw new Error("Item not found");
      }

      // Check availability
      if (bookData.sold) {
        throw new Error("This item has already been sold");
      }

      // Map to CheckoutBook format
      const checkoutBook: CheckoutBook = {
        id: bookData.id,
        title: bookData.title,
        author: bookData.author,
        price: bookData.price,
        condition: bookData.condition,
        isbn: bookData.isbn,
        description: bookData.description,
        category: bookData.category,
        image_url: bookData.imageUrl,
        front_cover: bookData.frontCover,
        additional_images: bookData.additionalImages,
        grade: bookData.grade,
        genre: bookData.genre,
        universityYear: bookData.universityYear,
        university: bookData.university,
        curriculum: bookData.curriculum,
        publisher: bookData.publisher,
        language: bookData.language,
        province: bookData.province,
        schoolName: bookData.schoolName,
        school_name: (bookData as any).school_name || bookData.schoolName,
        gender: bookData.gender,
        size: bookData.size,
        color: bookData.color,
        subject: bookData.subject,
        parcelSize: bookData.parcelSize,
        quantity: (bookData as any).quantity,
        availableQuantity: bookData.availableQuantity,
        available_quantity: (bookData as any).available_quantity,
        initialQuantity: bookData.initialQuantity,
        soldQuantity: bookData.soldQuantity,
        seller_id: bookData.seller.id,
        seller_name: bookData.seller.name,
        seller: {
          id: bookData.seller.id,
          name: bookData.seller.name,
          email: bookData.seller.email,
          hasAddress: true, // Will be validated in CheckoutFlow
          hasSubaccount: true, // Optimistically true, checked in payment step if needed
          isReadyForOrders: true,
        },
        rawDetails: {
          ...bookData,
        },
      };

      setBook(checkoutBook);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load item";
      setError(errorMessage);
      debugLogger.error("Checkout", "Error loading item data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-center">
              <div className="mb-4">{error}</div>
              <button
                onClick={() => navigate("/textbooks")}
                className="underline hover:no-underline"
              >
                Browse available books
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-center">
              Book not found. Please check the link and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <CheckoutFlow book={book} />;
};

export default Checkout;
