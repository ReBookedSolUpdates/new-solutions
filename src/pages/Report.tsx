import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, Send, Mail, Clock, Instagram, Facebook, Linkedin } from "lucide-react";
import { submitReport } from "@/services/reportService";
import TikTokIcon from "@/components/icons/TikTokIcon";
import XIcon from "@/components/icons/XIcon";

const Report = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportCategories = [
    { value: "technical", label: "Technical Issue" },
    { value: "payment", label: "Payment Problem" },
    { value: "listing", label: "Listing Issue" },
    { value: "account", label: "Account Problem" },
    { value: "spam", label: "Spam or Abuse" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !category ||
      !subject.trim() ||
      !description.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!user?.id) {
      toast.error("Please log in to submit a report");
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = await submitReport({
        userId: user.id,
        name: name.trim(),
        email: email.trim(),
        category,
        subject: subject.trim(),
        description: description.trim(),
        priority: "medium",
        status: "open",
      });

      toast.success(
        `Your report has been submitted! Ref: ${saved.id}`,
      );

      // Reset form
      setCategory("");
      setSubject("");
      setDescription("");

      // Redirect to home after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left — Form */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-red-700">Report an Issue</h1>
            </div>

            <p className="text-gray-600 mb-6">
              Let us know about any problems you're experiencing. We'll
              investigate and get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Issue Category *</Label>
                <Select onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Brief description of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about the issue, including steps to reproduce it if applicable..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right — Info */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              What Happens Next?
            </h2>

            <div className="divide-y divide-gray-100">
              <div className="flex flex-col items-center text-center py-6">
                <div className="bg-red-100 p-3 rounded-full mb-3">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Email Us Directly</h3>
                <p className="text-gray-600 mt-1">
                  support@rebookedsolutions.co.za
                </p>
                <a
                  href="mailto:support@rebookedsolutions.co.za"
                  className="text-red-600 hover:text-red-800 mt-1 inline-block"
                >
                  Send us an email
                </a>
              </div>

              <div className="flex flex-col items-center text-center py-6">
                <div className="bg-red-100 p-3 rounded-full mb-3">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Response Times</h3>
                <p className="text-gray-600 mt-1">Monday–Friday: 09:00–17:00</p>
                <p className="text-gray-600">Saturday–Sunday: Closed</p>
                <p className="text-gray-500 text-sm mt-1">We typically respond within 24 hours</p>
              </div>

              <div className="space-y-4 py-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Follow Us
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a
                    href="https://www.instagram.com/rebooked.solutions?igsh=M2ZsNjd2aTNmZmRh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-gray-700 p-2 rounded-lg transition-colors whitespace-nowrap overflow-hidden"
                  >
                    <Instagram className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a
                    href="https://www.facebook.com/share/16ngKMps6U/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-gray-700 p-2 rounded-lg transition-colors whitespace-nowrap overflow-hidden"
                  >
                    <Facebook className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">Facebook</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/rebooked-solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-gray-700 p-2 rounded-lg transition-colors whitespace-nowrap overflow-hidden"
                  >
                    <Linkedin className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/RebookedSol"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-gray-700 p-2 rounded-lg transition-colors whitespace-nowrap overflow-hidden"
                  >
                    <XIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">X</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@rebooked.solution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-gray-700 p-2 rounded-lg transition-colors whitespace-nowrap overflow-hidden md:col-span-1 col-span-2"
                  >
                    <TikTokIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">TikTok</span>
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-4">
                <div className="bg-red-50 border border-red-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    ReBooked Solutions Support
                  </h3>
                  <p className="text-gray-600">
                    Our dedicated support team is here to resolve any issues
                    you may have — from platform bugs to order disputes.
                  </p>
                  <ul className="text-sm text-red-800 space-y-1 mt-3">
                    <li>• Your report is immediately saved to our system</li>
                    <li>• Our team will review it within 24 hours</li>
                    <li>• You'll receive updates via email</li>
                    <li>• Critical issues are prioritized for faster resolution</li>
                  </ul>
                  <a
                    href="https://support.rebookedsolutions.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Visit Support Portal →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Report;
