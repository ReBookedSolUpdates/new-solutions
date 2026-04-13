import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, School, GraduationCap, BookOpen, MapPin, Shirt, Backpack, X } from "lucide-react";
import { UniversitySelector } from "@/components/ui/university-selector";
import { UNIVERSITY_YEARS } from "@/constants/universities";
import { getCategoriesByBookType, READER_CATEGORIES, SCHOOL_CATEGORIES, UNIVERSITY_CATEGORIES } from "@/constants/bookTypeCategories";
import { ALL_READER_GENRES } from "@/constants/readerGenres";

interface BookFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedCondition: string;
  setSelectedCondition: (condition: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  selectedCurriculum: string;
  setSelectedCurriculum: (curriculum: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedUniversityYear: string;
  setSelectedUniversityYear: (year: string) => void;
  selectedUniversity: string;
  setSelectedUniversity: (university: string) => void;
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  bookType: "all" | "school" | "university" | "reader" | "uniform" | "school_supply";
  setBookType: (type: "all" | "school" | "university" | "reader" | "uniform" | "school_supply") => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onSearch: (e: React.FormEvent) => void;
  onUpdateFilters: () => void;
  onClearFilters: () => void;
}

const checkboxStyle = "h-4 w-4 accent-[#2563eb] focus:ring-2 focus:ring-[#2563eb] border-gray-300 rounded cursor-pointer";

const BookFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  selectedGrade,
  setSelectedGrade,
  selectedCurriculum,
  setSelectedCurriculum,
  selectedGenre,
  setSelectedGenre,
  selectedUniversityYear,
  setSelectedUniversityYear,
  selectedUniversity,
  setSelectedUniversity,
  selectedProvince,
  setSelectedProvince,
  priceRange,
  setPriceRange,
  bookType,
  setBookType,
  showFilters,
  setShowFilters,
  onSearch,
  onUpdateFilters,
  onClearFilters,
}: BookFiltersProps) => {
  const getDisplayCategories = () => {
    if (bookType === "all") {
      const allCats = new Set<string>();
      [...SCHOOL_CATEGORIES, ...UNIVERSITY_CATEGORIES, ...READER_CATEGORIES].forEach(cat => allCats.add(cat));
      return Array.from(allCats).sort((a, b) => a.localeCompare(b));
    }
    if (bookType === "uniform" || bookType === "school_supply") return [];
    return getCategoriesByBookType(bookType as "school" | "university" | "reader");
  };

  const categories = getDisplayCategories();
  const conditions = ["New", "Good", "Better", "Average", "Below Average"];
  const grades = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
    "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
    "Study Guide", "Course Book",
  ];
  const curricula = ["CAPS", "Cambridge", "IEB"];
  const provinces = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
  ];

  // Uniform-specific filters
  const uniformGenders = ["Male", "Female", "Unisex"];
  const uniformSizes = ["XS", "S", "M", "L", "XL", "XXL", "Age 4–5", "Age 6–7", "Age 8–9", "Age 10–11", "Age 12–13", "Age 14–15", "Age 16+"];
  const uniformGrades = grades.filter(g => g.startsWith("Grade"));

  const handleConditionChange = (condition: string) => {
    setSelectedCondition(condition === selectedCondition ? "" : condition);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade === selectedGrade ? "" : grade);
    if (grade && grade !== selectedGrade) {
      setSelectedUniversityYear("");
      if (bookType !== "uniform" && bookType !== "school_supply") setBookType("school");
    }
  };

  const handleUniversityYearChange = (year: string) => {
    setSelectedUniversityYear(year === selectedUniversityYear ? "" : year);
    if (year && year !== selectedUniversityYear) {
      setSelectedGrade("");
      setBookType("university");
    }
  };

  const handleUniversityChange = (university: string) => {
    setSelectedUniversity(university);
    if (university) {
      setSelectedGrade("");
      setBookType("university");
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province === selectedProvince ? "" : province);
  };

  const handleBookTypeChange = (type: "all" | "school" | "university" | "reader" | "uniform" | "school_supply") => {
    setBookType(type);
    setSelectedGrade("");
    setSelectedUniversityYear("");
    setSelectedUniversity("");
    setSelectedGenre("");
    setSelectedCategory("");
  };

  const anyActive = Boolean(
    searchQuery || selectedCategory || selectedCondition || selectedGrade ||
    selectedCurriculum || selectedGenre || selectedUniversityYear ||
    selectedUniversity || selectedProvince
  );

  const TABS = [
    { key: "all" as const, label: "All", icon: <BookOpen className="h-4 w-4" /> },
    { key: "school" as const, label: "School", icon: <School className="h-4 w-4" /> },
    { key: "university" as const, label: "University", icon: <GraduationCap className="h-4 w-4" /> },
    { key: "reader" as const, label: "Readers", icon: <BookOpen className="h-4 w-4" /> },
    { key: "uniform" as const, label: "Uniforms", icon: <Shirt className="h-4 w-4" /> },
    { key: "school_supply" as const, label: "Supplies", icon: <Backpack className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-2">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex-1 flex items-center justify-center"
        >
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        {!showFilters && anyActive && (
          <Badge variant="outline" className="text-xs whitespace-nowrap">Filters active</Badge>
        )}
      </div>

      {/* Filters Section */}
      <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden"} lg:block`}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">Filters</h2>
            {anyActive && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="text-red-500 hover:text-red-600 p-0 h-auto text-xs flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>

          {/* Search */}
          <form onSubmit={onSearch}>
            <Label htmlFor="search" className="block text-xs font-semibold text-gray-600 mb-2">
              Search
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder={
                  bookType === "uniform" ? "Search by school, size, color..." :
                  bookType === "school_supply" ? "Search by subject, title..." :
                  "Search by title, author, ISBN..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Listing Type */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2">Listing Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleBookTypeChange(tab.key)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-all border rounded ${
                    bookType === tab.key
                      ? "bg-book-600 text-white border-book-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── BOOK SPECIFIC FILTERS ─── */}
          {bookType === "school" && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Grade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {grades.map((grade) => (
                    <label key={grade} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" id={`grade-${grade}`} checked={selectedGrade === grade}
                        onChange={() => handleGradeChange(grade)} className={checkboxStyle} />
                      <span className="text-sm text-gray-700">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Curriculum</h3>
                <Select value={selectedCurriculum} onValueChange={(value) => setSelectedCurriculum(value)}>
                  <SelectTrigger><SelectValue placeholder="Select curriculum" /></SelectTrigger>
                  <SelectContent>
                    {curricula.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {bookType === "university" && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">University</h3>
                <UniversitySelector value={selectedUniversity} onValueChange={handleUniversityChange} placeholder="Select university..." />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">University Year</h3>
                <div className="space-y-2">
                  {UNIVERSITY_YEARS.map((year) => (
                    <label key={year} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" id={`year-${year}`} checked={selectedUniversityYear === year}
                        onChange={() => handleUniversityYearChange(year)} className={checkboxStyle} />
                      <span className="text-sm text-gray-700">{year}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {bookType === "reader" && (
            <div>
              <h3 className="text-xs font-semibold text-gray-600 mb-2">Genre</h3>
              <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value)}>
                <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {ALL_READER_GENRES.map((genre) => <SelectItem key={genre} value={genre}>{genre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category — only for book types */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-600 mb-2">Category</h3>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ─── UNIFORM FILTERS ─── */}
          {bookType === "uniform" && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Grade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {uniformGrades.map((grade) => (
                    <label key={grade} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={selectedGrade === grade}
                        onChange={() => handleGradeChange(grade)} className={checkboxStyle} />
                      <span className="text-sm text-gray-700">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Gender</h3>
                <div className="flex gap-2 flex-wrap">
                  {uniformGenders.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedCategory(selectedCategory === g ? "" : g)}
                      className={`px-3 py-1.5 text-sm font-medium border rounded transition-all ${
                        selectedCategory === g
                          ? "bg-book-600 text-white border-book-600"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Size</h3>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {uniformSizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ─── SCHOOL SUPPLY FILTERS ─── */}
          {bookType === "school_supply" && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Grade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {uniformGrades.map((grade) => (
                    <label key={grade} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={selectedGrade === grade}
                        onChange={() => handleGradeChange(grade)} className={checkboxStyle} />
                      <span className="text-sm text-gray-700">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Subject</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    {[
                      "Mathematics", "English", "Afrikaans", "Life Sciences", "Physical Sciences",
                      "History", "Geography", "Economics", "Business Studies", "Accounting",
                      "Arts & Culture", "Technology", "Computer Science", "Life Orientation", "Other"
                    ].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Province */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2">Province</h3>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
              {provinces.map((province) => (
                <label key={province} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id={`province-${province}`} checked={selectedProvince === province}
                    onChange={() => handleProvinceChange(province)} className={checkboxStyle} />
                  <span className="text-sm text-gray-700">{province}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2">Condition</h3>
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleConditionChange(condition)}
                  className={`px-3 py-1.5 text-xs font-medium border rounded transition-all ${
                    selectedCondition === condition
                      ? "bg-book-600 text-white border-book-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-3">Price Range</h3>
            <Slider
              defaultValue={[0, 2000]}
              max={2000}
              step={10}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-3 text-sm font-semibold text-gray-700">
              <span>R{priceRange[0]}</span>
              <span>R{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookFilters;
