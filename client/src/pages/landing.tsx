import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChartLine, Download, TrendingUp, Shield, Users, Star, Gift, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const leadFormSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  investmentBudget: z.string().min(1, "Please select an investment amount"),
  age: z.string().min(1, "Please enter your age"),
  moneyAvailable: z.enum(["yes", "no"], {
    required_error: "Please select if money is readily available",
  }),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function Landing() {
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      investmentBudget: "",
      age: "",
      moneyAvailable: undefined,
    },
  });

  const leadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const leadData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        investmentBudget: data.investmentBudget,
        source: "landing_page",
        notes: `Age: ${data.age}, Money readily available: ${data.moneyAvailable}`,
      };
      const res = await apiRequest("POST", "/api/leads", leadData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thanks for your interest! Check your email for the free guide.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    leadMutation.mutate(data);
  };

  const scrollToForm = () => {
    const formSection = document.getElementById('leadCaptureSection');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LeadCaptureForm = ({ showBonus = false }) => (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">
          📥 Download Your Free Guide Now
        </CardTitle>
        {showBonus && (
          <p className="text-blue-100 mt-2">
            🎁 BONUS: Get a free invite to our exclusive webinar!
          </p>
        )}
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input data-testid="input-firstName" placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input data-testid="input-lastName" placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input data-testid="input-email" type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input data-testid="input-phone" placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input data-testid="input-age" type="number" placeholder="Enter your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="investmentBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Available to Invest</FormLabel>
                  <Select data-testid="select-investmentBudget" onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="R50k-R100k">R50k - R100k</SelectItem>
                      <SelectItem value="R100k-R200k">R100k - R200k</SelectItem>
                      <SelectItem value="R200k+">R200k+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moneyAvailable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is the money readily available?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      data-testid="radio-moneyAvailable"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              data-testid="button-submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold"
              disabled={leadMutation.isPending}
            >
              {leadMutation.isPending ? "Please wait..." : "Get Instant Access"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-900">
                  <TrendingUp className="inline-block text-yellow-500 mr-2" size={24} />
                  PE Wealth
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              🚀 How to Turn <span className="text-yellow-400">R50k into R200k+</span> with Private Equity
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              📈 Discover 5 Proven Strategies to Grow Your Wealth with Private Equity – Even If You're Starting with Just R50k
            </p>
            <Button 
              onClick={scrollToForm}
              className="bg-yellow-500 text-blue-900 px-8 py-4 text-xl font-bold hover:bg-yellow-400 transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Download className="mr-2" size={24} />
              Download Your Free Guide Now
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1: Why This Guide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-8">Why This Guide?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn how to:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Access high-growth startups & buyouts with R50k</li>
                      <li>• Earn 20%+ annual returns (beating stocks & property)</li>
                      <li>• Build a diversified portfolio for long-term wealth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">✅ What's Inside the Free Guide:</h3>
              <div className="space-y-4">
                <Card className="p-4 border-l-4 border-l-blue-600">
                  <p className="font-semibold">1. 5 Private Equity Strategies for R50k investors</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-600">
                  <p className="font-semibold">2. Case Studies: How others grew R50k to R150k+</p>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-600">
                  <p className="font-semibold">3. Tax Benefits & Risk Management Tips</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Who Is This For */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">🎯 Who Is This For?</h2>
            <p className="text-xl text-gray-600">This guide is perfect for:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="mx-auto text-blue-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Professionals</h3>
                <p className="text-gray-600">with R50k+ to invest</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <TrendingUp className="mx-auto text-green-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Business Owners</h3>
                <p className="text-gray-600">looking to diversify</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <ChartLine className="mx-auto text-yellow-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">Savvy Investors</h3>
                <p className="text-gray-600">tired of low stock market returns</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 3: Social Proof */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-8">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "This guide helped me understand private equity in simple terms. I invested R50k and already see great returns!"
                </p>
                <p className="font-semibold text-blue-900">– John D., Cape Town</p>
              </CardContent>
            </Card>
            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Finally, a resource that makes private equity accessible for small investors. Highly recommend!"
                </p>
                <p className="font-semibold text-blue-900">– Sarah M., Johannesburg</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: First Lead Capture */}
      <section id="leadCaptureSection" className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadCaptureForm />
        </div>
      </section>

      {/* Section 5: Bonus Offer */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-blue-900">
            <Gift className="mx-auto mb-4" size={64} />
            <h2 className="text-4xl font-bold mb-4">
              🎁 BONUS OFFER
            </h2>
            <p className="text-xl font-semibold">
              Sign up now and get a free invite to our exclusive webinar: 
              "How to Invest R50k in Private Equity for High Returns."
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "❓ Is private equity safe for small investors?",
                answer: "✅ Yes! Our guide explains how to mitigate risks and choose vetted opportunities."
              },
              {
                question: "❓ Can I really start with just R50k?",
                answer: "✅ Absolutely! We'll show you low-minimum funds and strategies."
              }
            ].map((faq, index) => (
              <Card key={index} className="cursor-pointer" onClick={() => setShowFAQ(showFAQ === index ? null : index)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                    <ChevronDown className={`transform transition-transform ${showFAQ === index ? 'rotate-180' : ''}`} />
                  </div>
                  {showFAQ === index && (
                    <p className="mt-4 text-gray-700">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">
              📥 Don't Miss Out – Download Your Free Guide Today!
            </h2>
          </div>
          <LeadCaptureForm showBonus={true} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">PE Wealth</h3>
            <p className="text-blue-200 mb-8">Empowering South African investors to build wealth through private equity</p>
            <div className="flex justify-center space-x-8">
              <Shield className="text-blue-300" size={32} />
              <TrendingUp className="text-green-400" size={32} />
              <Users className="text-yellow-400" size={32} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}