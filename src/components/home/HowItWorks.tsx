import { Package, Search, Star, TrendingDown } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Package,
      title: "List Your Items",
      description:
        "Create a listing for any school-related item in minutes — textbooks, uniforms, supplies. Add photos, set your price, and choose a parcel size.",
    },
    {
      number: "02",
      icon: Search,
      title: "Browse & Buy",
      description:
        "Find exactly what you need from verified student sellers. All transactions are secured and tracked end-to-end.",
    },
    {
      number: "03",
      icon: TrendingDown,
      title: "Save Money",
      description:
        "Buyers save on school costs, sellers earn on items they no longer need. Everyone wins — and waste is reduced.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple from start to finish.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Three simple steps to buy or sell school items on ReBooked Solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg border border-gray-200 p-8 transition-shadow hover:shadow-lg"
            >
              {/* Step number */}
              <span className="text-3xl font-bold text-book-600 mb-4 block">
                {step.number}
              </span>

              {/* Icon Container */}
              <div className="w-12 h-12 bg-book-600 rounded-lg flex items-center justify-center mb-4">
                <step.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
