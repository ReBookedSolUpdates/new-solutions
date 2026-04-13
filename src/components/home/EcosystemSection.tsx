import { BookOpen, GraduationCap, Home, ExternalLink } from "lucide-react";

const ecosystemItems = [
  {
    name: "ReBooked Solutions",
    tagline: "The Marketplace",
    description:
      "South Africa's trusted second-hand textbook marketplace. Buy and sell school and university textbooks securely with nationwide delivery, buyer protection, and verified listings.",
    icon: BookOpen,
    iconBg: "bg-book-100",
    iconColor: "text-book-600",
    href: "https://www.rebookedsolutions.co.za/",
    internal: true,
  },
  {
    name: "ReBooked Genius",
    tagline: "AI Study Companion",
    description:
      "An AI-powered study platform built for South African students. Practice with real CAPS, IEB & Cambridge past papers, get instant explanations, AI-generated study notes, and master your syllabus with a personal AI tutor — available 24/7.",
    icon: GraduationCap,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "https://genius.rebookedsolutions.co.za/",
    internal: false,
  },
  {
    name: "ReBooked Living",
    tagline: "Student Accommodation",
    description:
      "Find verified, NSFAS-accredited student accommodation near South African universities. Browse 4 000+ listings, compare prices, and connect directly with landlords — all in one place.",
    icon: Home,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    href: "https://living.rebookedsolutions.co.za/",
    internal: false,
  },
];

const EcosystemSection = () => (
  <section className="py-16 sm:py-24 bg-white">
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The <span className="text-book-600">ReBooked Solutions</span> Ecosystem
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Three platforms, one mission — making education more accessible and affordable for every South African student.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {ecosystemItems.map((item) => (
          <a
            key={item.name}
            href={item.internal ? undefined : item.href}
            target={item.internal ? undefined : "_blank"}
            rel={item.internal ? undefined : "noopener noreferrer"}
            onClick={item.internal ? (e) => e.preventDefault() : undefined}
            className="flex flex-col rounded-lg bg-white border border-gray-200 p-6 transition-shadow hover:shadow-lg cursor-default md:cursor-pointer"
          >
            {/* Icon */}
            <div className={`w-12 h-12 ${item.iconBg} rounded-lg flex items-center justify-center mb-4`}>
              <item.icon className={`h-6 w-6 ${item.iconColor}`} />
            </div>

            {/* Content */}
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {item.tagline}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-gray-600 leading-relaxed text-sm flex-1">
              {item.description}
            </p>

            {/* Link */}
            {!item.internal && (
              <div className="mt-4 inline-flex items-center gap-1.5 text-book-600 font-semibold text-sm">
                Visit Site <ExternalLink className="h-4 w-4" />
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default EcosystemSection;
