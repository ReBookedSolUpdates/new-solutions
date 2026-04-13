import React from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Clock, ShieldCheck, Wallet, ArrowRight, Sparkles, CreditCard, PackageSearch } from "lucide-react";


const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: React.ReactNode }) => (
  <div className="flex flex-col items-start gap-1">
    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">{children}</h2>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
  </div>
);

const Shipping = () => {

  return (
    <Layout>
      <SEO
        title="Shipping & Payments – Reliable Delivery & Secure Payments"
        description="Courier Guy shipping with Pudo lockers and multiple payment options. We connect to trusted couriers and accept EFT, cards, and digital payments through our secure BobPay gateway."
        keywords="shipping, payments, courier guy, pudo, locker delivery, delivery tracking, bobpay, south africa, textbook delivery"
        url="https://www.rebookedsolutions.co.za/shipping"
      />

      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* Hero */}
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shipping & Payments
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              We partner with The Courier Guy and Pudo lockers to offer reliable nationwide delivery. All payments are securely processed through our BobPay gateway, so you can buy and sell with confidence.
            </p>
          </div>

          {/* Why The Courier Guy */}
          <Card className="border border-gray-200">
            <CardHeader>
              <SectionTitle>Why we use The Courier Guy</SectionTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Reliable nationwide delivery</p>
                    <p className="text-gray-600 text-sm mt-1">Fast and efficient door-to-door service with real-time tracking.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Flexible Options</p>
                    <p className="text-gray-600 text-sm mt-1">Choose between locker-to-locker, door-to-locker, or door-to-door.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Competitive rates</p>
                    <p className="text-gray-600 text-sm mt-1">Affordable shipping starting from just R50 for locker delivery.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pudo Section */}
          <Card className="border border-gray-200">
            <CardHeader>
              <SectionTitle>Pickup with Pudo Lockers</SectionTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Availability</p>
                    <p className="text-gray-600 text-sm mt-1">Pick up your books whenever it suits you, even after hours.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Budget-Friendly</p>
                    <p className="text-gray-600 text-sm mt-1">Locker-to-locker delivery is our most affordable shipping method.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Safe and Secure</p>
                    <p className="text-gray-600 text-sm mt-1">Your parcel is safe in a smart locker, accessible only with your unique PIN.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">1,100+ Locations</p>
                    <p className="text-gray-600 text-sm mt-1">Find a Pudo locker in malls, gas stations, and shopping centers nationwide.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Couriers */}
          <Card className="border border-gray-200">
            <CardHeader>
              <SectionTitle>Our Logistics Partner</SectionTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We use The Courier Guy and Pudo lockers because they're South Africa's most trusted delivery network, offering reliable nationwide coverage with 1,100+ pickup points.</p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-book-100 text-book-700 border border-book-200 text-sm py-2 px-3">
                  <Truck className="h-4 w-4 mr-2" /> The Courier Guy
                </Badge>
                <Badge className="bg-book-100 text-book-700 border border-book-200 text-sm py-2 px-3">
                  <Truck className="h-4 w-4 mr-2" /> Pudo
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border border-gray-200">
            <CardHeader>
              <SectionTitle>What you get</SectionTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">For Buyers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <PackageSearch className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Live tracking and delivery notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Trusted couriers with proven reliability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Fair pricing set at checkout</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">For Sellers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Quick courier bookings after buyer confirms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Seamless pickups—just hand over your package</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-book-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full transparency from pickup to delivery</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Section */}
          <Card className="border border-gray-200 overflow-hidden">
            <div className="bg-book-600 px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="text-lg font-bold">Secure Payment Methods</h2>
              </div>
            </div>

            <CardContent className="p-0">
              {/* Main Intro */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-base mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-book-600" />
                  Powered by BobPay
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All payments are securely processed through BobPay. Every transaction is encrypted using industry-leading protocols—your financial data stays safe and secure at all times.
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Method Groups */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Cards & Digital */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">Cards & Digital Wallets</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2F0dcafa29bfc243b6bd9f8ca37848a776", alt: "Mastercard" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2Fb4a7128bece94bce91c7dbb723bae4aa", alt: "Visa" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2F58416a87bee74a149a037161b4ccecb2", alt: "Amex" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2Fdbd88b71b59d4aa29a7fb7d4e1db328e", alt: "Diners" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2Fb66a58cbee0047d4981eb8e5c3c445d4", alt: "PayShap" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2F18aac1c1e7ba4b7bb6ea87a8502d3494", alt: "Scan to Pay" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-center bg-gray-100 rounded-lg h-14 p-2">
                          <img src={item.src} alt={item.alt} className="max-h-8 max-w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EFT & Instant Pay */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">EFT & Bank Transfers</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2F2b87ac3333ab4c1f93eee9ebbcb5ba96", alt: "Instant EFT" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2Ff86c103bcebd46d09d376400d4b98994", alt: "Manual EFT" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2F7b5f53b3422f4126a4e66bf2f2237d2b", alt: "Capitec Pay" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2Fa6df1c109fcb48eb8f700f0ee1ba5838", alt: "Nedbank Pay" },
                        { src: "https://cdn.builder.io/api/v1/image/assets%2Fbe2ca462026542bf80e06aef7423f7d8%2F8c6f5798a2024ce3ae6175c3acdcda15", alt: "ABSA Pay" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-center bg-gray-100 rounded-lg h-14 p-2">
                          <img src={item.src} alt={item.alt} className="max-h-8 max-w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust & Security */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">Security</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <ShieldCheck className="h-4 w-4 text-book-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Encrypted Checkout</p>
                          <p className="text-xs text-gray-600">256-bit SSL protection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <ShieldCheck className="h-4 w-4 text-book-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Privacy Guaranteed</p>
                          <p className="text-xs text-gray-600">Your card data never stored</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
