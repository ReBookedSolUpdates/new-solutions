import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SellerReview, reviewService } from "@/services/reviewService";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import debugLogger from "@/utils/debugLogger";

interface ReviewEditDialogProps {
  review: SellerReview;
  isOpen: boolean;
  onClose: () => void;
  onReviewUpdated?: () => void;
}

const ReviewEditDialog: React.FC<ReviewEditDialogProps> = ({
  review,
  isOpen,
  onClose,
  onReviewUpdated,
}) => {
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(review.comment || "");
  const [isAnonymous, setIsAnonymous] = useState(review.is_anonymous);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.updateReview(review.id, {
        rating,
        comment: comment.trim() || undefined,
        isAnonymous,
      });
      toast.success("Review updated successfully");
      onReviewUpdated?.();
      onClose();
    } catch (error) {
      debugLogger.error("ReviewEditDialog", "Error updating review:", error);
      toast.error("Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Your Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Star Rating */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
            <Label className="block mb-4 text-base font-semibold">How would you rate this seller?</Label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-all hover:scale-125 cursor-pointer"
                  title={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-10 w-10 transition-all ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-sm font-medium text-gray-700">
                  Rating: <span className="text-amber-600 font-bold">{rating} out of 5 stars</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {rating === 1 && "❌ Poor - Had significant issues"}
                  {rating === 2 && "😟 Fair - Some problems"}
                  {rating === 3 && "😐 Good - Meets expectations"}
                  {rating === 4 && "😊 Very Good - Exceeded expectations"}
                  {rating === 5 && "🎉 Excellent - Outstanding experience"}
                </p>
              </div>
            )}
          </div>

          {/* Comment */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <Label htmlFor="edit-comment" className="block mb-3 text-base font-semibold">
              Your Feedback <span className="text-gray-500 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="edit-comment"
              placeholder="Tell other buyers about your experience. What did this seller do well? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              className="resize-none border-gray-300 focus:ring-2 focus:ring-amber-500"
              rows={5}
            />
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-gray-600">
                Help others make informed decisions
              </p>
              <p className="text-sm font-medium text-gray-600">
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Anonymity Toggle */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Label
                  htmlFor="edit-anonymous"
                  className="text-base font-semibold text-gray-900 cursor-pointer block mb-1"
                >
                  Post Anonymously
                </Label>
                <p className="text-sm text-gray-700">
                  {isAnonymous
                    ? "Your name and profile picture will be hidden from this review"
                    : "Your name and profile picture will be shown with this review"}
                </p>
              </div>
              <Switch
                id="edit-anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[44px] text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="min-h-[44px] text-base bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewEditDialog;
