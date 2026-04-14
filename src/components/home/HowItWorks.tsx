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
    <section className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple from start to finish.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Three simple steps to buy or sell school items on ReBooked Solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg border border-gray-200 p-4 sm:p-5 transition-all duration-200 hover:shadow-md h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl sm:text-2xl font-bold text-book-600 leading-none">
                  {step.number}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-book-600 rounded-md flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2">
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
