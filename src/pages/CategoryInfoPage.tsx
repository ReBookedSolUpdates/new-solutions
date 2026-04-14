import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shirt, Pencil, PackageCheck, Truck } from "lucide-react";

const LOCKER_GUIDE = [
  "Mini: about 41cm x 38cm x 64cm",
  "Medium: about 41cm x 41cm x 64cm",
  "Large: about 44cm x 53cm x 64cm",
  "X-Large: about 45cm x 59cm x 64cm",
];

const DATA: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    buyingSelling: string[];
    conditionGuide: string[];
    categoryNotes: string[];
    parcelTips: string[];
  }
> = {
  textbooks: {
    title: "Textbooks Guide",
    subtitle: "How to buy and sell textbooks properly on ReBooked",
    icon: <BookOpen className="h-5 w-5 text-book-600" />,
    buyingSelling: [
      "Include title, author, ISBN, edition year, and grade/year in your listing.",
      "Buyers should always confirm edition compatibility before checkout.",
      "If listing a set, show exactly which books are included.",
    ],
    conditionGuide: [
      "Photograph front/back cover and sample inside pages.",
      "Disclose highlighting, notes, torn pages, and water damage clearly.",
      "Mention if any pages are missing or heavily marked.",
    ],
    categoryNotes: [
      "Edition mismatches are the number one cause of textbook returns.",
      "Always include ISBN if available for quick verification.",
      "State whether writing is light, moderate, or heavy.",
    ],
    parcelTips: [
      "Single textbook: Mini or Medium locker usually works.",
      "2-3 heavy textbooks: Medium or Large depending on thickness.",
      "Bulky bundles: prefer door-to-door if uncertain.",
    ],
  },
  uniforms: {
    title: "Uniforms Guide",
    subtitle: "Uniform listings that reduce disputes and speed up sales",
    icon: <Shirt className="h-5 w-5 text-book-600" />,
    buyingSelling: [
      "Include school name, garment type, tag size, and actual measurements.",
      "Mention if item is summer, winter, or sports uniform.",
      "Buyers should compare measurements, not only tag sizes.",
    ],
    conditionGuide: [
      "Disclose stains, fading, stitching issues, and missing buttons/zips.",
      "Include close-up photos of logo, badge, and cuffs/collar.",
      "Mention if alterations were made (hemming, waist take-in, etc).",
    ],
    categoryNotes: [
      "School-specific branding must be clearly visible in photos.",
      "State wash condition (no odor, no shrinkage, no color bleed).",
      "Pair items into bundles to improve sell-through.",
    ],
    parcelTips: [
      "Shirts/shorts: Mini or Medium locker.",
      "Blazers/jackets or full sets: Medium or Large.",
      "Very bulky winter sets: door-to-door recommended.",
    ],
  },
  "school-supplies": {
    title: "School Supplies Guide",
    subtitle: "From stationery to sports gear — list clearly and ship smart",
    icon: <Pencil className="h-5 w-5 text-book-600" />,
    buyingSelling: [
      "List exactly what is included (brand, quantity, accessories, dimensions).",
      "For sets, include a clear itemized breakdown.",
      "For sports gear, include length/weight and age or grade suitability.",
    ],
    conditionGuide: [
      "Disclose scratches, dents, grip wear, and missing parts.",
      "For stationery bundles, show all pieces in one photo.",
      "For equipment, include close-ups of damaged/high-wear areas.",
    ],
    categoryNotes: [
      "This category includes stationery, calculators, art kits, hockey sticks, cricket bats, and more.",
      "Oversized items may require door-to-door delivery.",
      "Include dimensions to avoid locker-size mistakes.",
    ],
    parcelTips: [
      "Small stationery packs: Mini or Medium locker.",
      "Shoes/helmet-sized items: Medium or Large locker.",
      "Long items (hockey sticks/cricket bats): door-to-door only.",
    ],
  },
};

const CategoryInfoPage = () => {
  const { slug = "textbooks" } = useParams();
  const page = DATA[slug] || DATA.textbooks;

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="bg-gradient-to-r from-book-50 to-white border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            {page.icon}
            <h1 className="text-3xl font-bold">{page.title}</h1>
          </div>
          <p className="text-gray-600">{page.subtitle}</p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">ReBooked Category Guide</Badge>
            <Badge variant="outline">South Africa</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">How Buying & Selling Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {page.buyingSelling.map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Condition Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {page.conditionGuide.map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Category Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {page.categoryNotes.map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-book-600" />
                Parcel Size Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {page.parcelTips.map((item) => (
                <p key={item}>- {item}</p>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-4 w-4 text-book-600" />
              Courier Guy Locker Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {LOCKER_GUIDE.map((line) => (
                <div key={line} className="border rounded-xl p-3 bg-gray-50 text-sm font-medium text-gray-700">
                  {line}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Locker dimensions can vary by location. If an item is long, bulky, or tightly packed, use door-to-door to avoid failed drop-offs.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CategoryInfoPage;
