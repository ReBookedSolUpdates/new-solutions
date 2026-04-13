import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface MoreFromCategoryProps {
  category: string;
  currentBookId: string;
}

const MoreFromCategory = ({ category, currentBookId }: MoreFromCategoryProps) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, price, image_url, front_cover, condition")
        .eq("category", category)
        .eq("sold", false)
        .neq("id", currentBookId)
        .limit(12);

      if (!error && data) setBooks(data);
    };
    fetchBooks();
  }, [category, currentBookId]);

  if (books.length === 0) return null;

  const visibleCount = 4;
  const maxIndex = Math.max(0, books.length - visibleCount);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">More from {category}</h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
            disabled={scrollIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScrollIndex(Math.min(maxIndex, scrollIndex + 1))}
            disabled={scrollIndex >= maxIndex}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${scrollIndex * 25}%)` }}
        >
          {books.map((book) => (
            <div key={book.id} className="w-1/2 sm:w-1/3 lg:w-1/4 flex-shrink-0">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                  <img
                    src={book.front_cover || book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 truncate">{book.author}</p>
                  <p className="text-sm font-bold text-book-600 mt-1">R{book.price}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreFromCategory;
