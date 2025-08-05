import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Shield, Users, Download, Play, Star } from "lucide-react";
import LeadCaptureForm from "@/components/lead-capture-form";

export default function Landing() {
  const [showLeadForm, setShowLeadForm] = useState(false);

  const scrollToForm = () => {
    const formSection = document.getElementById('leadCaptureSection');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-playfair font-bold text-navy">
                  <ChartLine className="inline-block text-gold mr-2" size={24} />
                  PE Capital
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-dark-gray hover:text-navy px-3 py-2 text-sm font-medium">About</a>
                <a href="#" className="text-dark-gray hover:text-navy px-3 py-2 text-sm font-medium">Services</a>
                <a href="#" className="text-dark-gray hover:text-navy px-3 py-2 text-sm font-medium">Contact</a>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-navy text-white hover:bg-navy/90 mr-2"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  variant="outline"
                  className="border-navy text-navy hover:bg-navy hover:text-white"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="from-navy via-navy to-blue-900 text-white bg-[#1e2b4d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-gold text-lg font-semibold mb-4">🚀 INVESTMENT GUIDE</div>
              <h1 className="text-5xl font-playfair font-bold leading-tight mb-6">
                How to Turn R50k into 
                <span className="text-gold"> R200k+</span> with Private Equity
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                📈 Discover 5 Proven Strategies to Grow Your Wealth with Private Equity – Even If You're Starting with Just R50k
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToForm}
                  className="bg-gold text-navy px-8 py-4 text-lg font-semibold hover:bg-gold/90"
                  size="lg"
                >
                  <Download className="mr-2" size={20} />
                  Get Instant Access
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-navy"
                  size="lg"
                >
                  <Play className="mr-2" size={20} />
                  Free Webinar
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-gold/10 to-gold/30 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ChartLine className="mx-auto text-4xl text-gold mb-4" size={48} />
                      <p className="font-semibold text-lg">FREE Investment Guide</p>
                      <p className="text-sm opacity-90">R50k to R200k+ Strategy</p>
                      <div className="mt-4 text-xs bg-gold text-navy px-3 py-1 rounded-full inline-block">
                        5 Proven Methods
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Why This Guide Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-navy mb-4">
              Why This Guide?
            </h2>
            <p className="text-xl text-dark-gray max-w-3xl mx-auto">
              Learn how to access high-growth opportunities and build long-term wealth with private equity investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-navy mb-6">✅ Learn how to:</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start">
                  <ChartLine className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>Access high-growth startups & buyouts with R50k</span>
                </li>
                <li className="flex items-start">
                  <ChartLine className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>Earn 20%+ annual returns (beating stocks & property)</span>
                </li>
                <li className="flex items-start">
                  <ChartLine className="text-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <span>Build a diversified portfolio for long-term wealth</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-navy mb-6">✅ What's Inside the Free Guide:</h3>
              <div className="space-y-4">
                <Card className="p-4 border-l-4 border-gold">
                  <p className="font-semibold text-navy">1. 5 Private Equity Strategies for R50k investors</p>
                </Card>
                <Card className="p-4 border-l-4 border-gold">
                  <p className="font-semibold text-navy">2. Case Studies: How others grew R50k to R150k+</p>
                </Card>
                <Card className="p-4 border-l-4 border-gold">
                  <p className="font-semibold text-navy">3. Tax Benefits & Risk Management Tips</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-8">
            🎯 Who Is This For?
          </h2>
          <p className="text-xl text-dark-gray mb-8">This guide is perfect for:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="text-gold mx-auto mb-4" size={48} />
                <h3 className="font-semibold text-navy mb-2">Professionals</h3>
                <p className="text-dark-gray">with R50k+ to invest</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Shield className="text-gold mx-auto mb-4" size={48} />
                <h3 className="font-semibold text-navy mb-2">Business Owners</h3>
                <p className="text-dark-gray">looking to diversify</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <ChartLine className="text-gold mx-auto mb-4" size={48} />
                <h3 className="font-semibold text-navy mb-2">Savvy Investors</h3>
                <p className="text-dark-gray">tired of low stock market returns</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Lead Capture Section */}
      <section id="leadCaptureSection" className="py-20 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
                  📥 Download Your Free Guide Now
                </h2>
                <p className="text-lg text-dark-gray">
                  "How to Turn R50k into R200k+ with Private Equity" - Learn 5 proven strategies and start building wealth today.
                </p>
              </div>
              
              <LeadCaptureForm />
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
              🌟 What Our Investors Say
            </h2>
            <p className="text-lg text-dark-gray">Real results from real South African investors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gray-50 border-2 border-gold/20">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-dark-gray italic text-lg mb-4">
                  "This guide helped me understand private equity in simple terms. I invested R50k and already see great returns!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold/20 mr-4 flex items-center justify-center">
                    <Users size={24} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">John D.</h4>
                    <p className="text-sm text-dark-gray">Cape Town</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-2 border-gold/20">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-dark-gray italic text-lg mb-4">
                  "Finally, a resource that makes private equity accessible for small investors. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold/20 mr-4 flex items-center justify-center">
                    <Users size={24} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Sarah M.</h4>
                    <p className="text-sm text-dark-gray">Johannesburg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bonus Offer Section */}
      <section className="py-16 bg-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
            🎁 Exclusive Bonus Offer
          </h2>
          <Card className="bg-white shadow-lg border-2 border-gold">
            <CardContent className="p-8">
              <p className="text-xl text-dark-gray mb-6">
                Sign up now and get a <strong className="text-gold">free invite</strong> to our exclusive webinar:
              </p>
              <h3 className="text-2xl font-semibold text-navy mb-4">
                "How to Invest R50k in Private Equity for High Returns"
              </h3>
              <Button 
                onClick={scrollToForm}
                className="bg-gold text-navy px-8 py-4 text-lg font-semibold hover:bg-gold/90"
                size="lg"
              >
                <Download className="mr-2" size={20} />
                Claim Your Free Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-navy mb-4">
              ❓ Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-navy mb-3">
                  "Is private equity safe for small investors?"
                </h3>
                <p className="text-dark-gray">
                  ✅ Yes! Our guide explains how to mitigate risks and choose vetted opportunities. 
                  We show you exactly how to evaluate investments and protect your capital.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-navy mb-3">
                  "Can I really start with just R50k?"
                </h3>
                <p className="text-dark-gray">
                  ✅ Absolutely! We'll show you low-minimum funds and strategies specifically 
                  designed for investors starting with R50k or more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-4">
            📥 Don't Miss Out – Download Your Free Guide Today!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of South Africans already building wealth through private equity
          </p>
          
          <Card className="bg-white text-navy shadow-xl">
            <CardContent className="p-8">
              <LeadCaptureForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
