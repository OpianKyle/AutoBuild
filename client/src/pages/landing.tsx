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
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-navy text-white hover:bg-navy/90"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-playfair font-bold leading-tight mb-6">
                Invest R50k in 
                <span className="text-gold"> Private Equity</span>
                with Confidence
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Download your free guide and learn 5 proven strategies for high returns. 
                Join thousands of South African investors building wealth through private equity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToForm}
                  className="bg-gold text-navy px-8 py-4 text-lg font-semibold hover:bg-gold/90"
                  size="lg"
                >
                  <Download className="mr-2" size={20} />
                  Get Free Guide
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-navy"
                  size="lg"
                >
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center text-dark-gray">
                      <ChartLine className="mx-auto text-4xl text-gold mb-4" size={48} />
                      <p className="font-semibold">Investment Dashboard Preview</p>
                      <p className="text-sm text-gray-600">Track your portfolio performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-navy mb-4">
              Why Choose PE Capital?
            </h2>
            <p className="text-xl text-dark-gray max-w-3xl mx-auto">
              Our automated platform makes private equity investing accessible, transparent, and profitable for South African investors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="bg-gold bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-2xl text-gold" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-4">Secure & Regulated</h3>
                <p className="text-dark-gray">Fully compliant with South African financial regulations with bank-grade security.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="bg-gold bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <ChartLine className="text-2xl text-gold" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-4">Proven Returns</h3>
                <p className="text-dark-gray">Average returns of 15-25% annually with carefully vetted investment opportunities.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="bg-gold bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Users className="text-2xl text-gold" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-4">Expert Support</h3>
                <p className="text-dark-gray">Dedicated investment advisors to guide you through every step of your journey.</p>
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
                  Download Your Free Investment Guide
                </h2>
                <p className="text-lg text-dark-gray">
                  "How to Invest R50k in Private Equity" - Learn from industry experts and start building wealth today.
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
              Trusted by South African Investors
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                    <Users size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Thabo Mthembu</h4>
                    <p className="text-sm text-dark-gray">Cape Town Investor</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-dark-gray italic">"Increased my investment by 180% in just 2 years. The platform is incredibly user-friendly."</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                    <Users size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Sarah Williams</h4>
                    <p className="text-sm text-dark-gray">Johannesburg Entrepreneur</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-dark-gray italic">"The automated system saved me hours of research. Now I can focus on growing my business."</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                    <Users size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Michael Roberts</h4>
                    <p className="text-sm text-dark-gray">Durban Professional</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-dark-gray italic">"Best investment decision I've ever made. The returns speak for themselves."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
