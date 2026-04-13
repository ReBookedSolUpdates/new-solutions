import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "What is ReBooked Solutions?",
      answer: "ReBooked Solutions is South Africa's peer-to-peer marketplace for buying and selling school-related items — textbooks, uniforms, and school supplies. We connect students, parents, and educators so they can trade affordably and securely with nationwide delivery."
    },
    {
      question: "What can I buy or sell on ReBooked?",
      answer: "You can list and purchase textbooks (school and university), school uniforms, and school supplies. All items must be genuine and in fair condition."
    },
    {
      question: "How do I buy an item?",
      answer: "Browse listings, add items to your cart, and complete payment via our secure BobPay checkout. The seller then has 48 hours to confirm the sale. If they don't confirm, you're automatically refunded."
    },
    {
      question: "How do I sell an item?",
      answer: "Create a free account, click 'Sell Your Items', upload photos and details, set your price, and publish. Once a buyer purchases, you'll be notified to confirm the sale and arrange pickup."
    },
    {
      question: "What happens if a seller doesn't confirm the sale?",
      answer: "If the seller doesn't respond within 48 hours, the order is automatically cancelled and the buyer receives a full refund — no action needed on your part."
    },
    {
      question: "How does delivery work?",
      answer: "Once the seller confirms, shipping is arranged via The Courier Guy with door-to-door or locker pickup/delivery options. You'll receive a tracking number to follow your parcel in real time."
    },
    {
      question: "Is ReBooked Solutions safe to use?",
      answer: "Yes. All payments are processed securely through BobPay. Funds are only released to the seller after the sale is confirmed. We also have buyer protection, verified listings, and a dedicated support team for disputes."
    },
    {
      question: "Does it cost anything to list an item?",
      answer: "Listing is completely free. We charge a 10% platform fee on completed sales, which is already included in the price the buyer sees."
    },
    {
      question: "Can I message a seller before buying?",
      answer: "Yes! Click 'Chat to Seller' on any listing to start a conversation. You can ask questions about the item's condition, negotiate, or arrange details before purchasing."
    },
    {
      question: "How do I get help?",
      answer: "You can reach us at info@rebookedsolutions.co.za, use our Contact form, or chat with our AI assistant on any page. We also have a Getting Started guide for new users."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Card className="max-w-4xl mx-auto w-full">
          <CardHeader className="text-center px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-book-800">Frequently Asked Questions</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Find answers to common questions about using ReBooked Solutions
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Accordion type="single" collapsible className="w-full space-y-2 sm:space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-3 sm:px-4 overflow-hidden">
                  <AccordionTrigger className="text-left hover:no-underline py-3 sm:py-4 min-h-[44px] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 [&>svg]:ml-2 flex justify-between items-start gap-2 w-full">
                    <span className="font-medium text-book-800 text-sm sm:text-base break-words hyphens-auto leading-tight flex-1 min-w-0 max-w-full overflow-hidden text-ellipsis">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 sm:pb-4">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 sm:mt-12 text-center p-4 sm:p-6 bg-book-50 rounded-lg border border-book-200">
              <h3 className="text-lg sm:text-xl font-semibold text-book-800 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                If you couldn't find the answer you're looking for, feel free to contact our support team.
              </p>
              <Link to="/contact">
                <Button className="bg-book-600 hover:bg-book-700 min-h-[44px] px-4 py-2">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span className="text-sm sm:text-base">Contact Support</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FAQ;
