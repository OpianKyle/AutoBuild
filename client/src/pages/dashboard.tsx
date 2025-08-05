import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartLine, LogOut, Users, BarChart3, Mail, Calendar, Home } from "lucide-react";
import CRMDashboard from "@/components/crm-dashboard";
import EmailAutomation from "@/components/email-automation";
import BookingSystem from "@/components/booking-system";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStats, InvestmentStats, EmailStats } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "crm", label: "CRM", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "email", label: "Email", icon: Mail },
    { id: "booking", label: "Booking", icon: Calendar },
  ];

  const { data: leadStats } = useQuery<LeadStats>({
    queryKey: ["/api/analytics/leads"],
  });

  const { data: investmentStats } = useQuery<InvestmentStats>({
    queryKey: ["/api/analytics/investments"],
  });

  const { data: emailStats } = useQuery<EmailStats>({
    queryKey: ["/api/analytics/emails"],
  });

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-light-gray flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-playfair font-bold text-navy">
            <ChartLine className="inline-block text-gold mr-2" size={20} />
            PE Capital
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors",
                      activeTab === item.id
                        ? "bg-gold/10 text-navy border-l-4 border-gold"
                        : "text-dark-gray hover:bg-gray-50 hover:text-navy"
                    )}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3" />
              )}
              <span className="font-medium text-dark-gray">
                {user?.firstName || "Admin"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-dark-gray hover:text-navy"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">{/* Content based on activeTab */}

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-navy mb-2">Dashboard Overview</h2>
                <p className="text-dark-gray">Monitor your sales funnel performance and key metrics</p>
              </div>
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Leads</p>
                      <p className="text-3xl font-bold text-navy">{leadStats?.total || 0}</p>
                      <p className="text-sm text-green-600">↗ 12% from last month</p>
                    </div>
                    <div className="bg-blue-50 rounded-full p-3">
                      <ChartLine className="text-xl text-blue-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-3xl font-bold text-navy">
                        {leadStats?.total && leadStats?.closed ? ((leadStats.closed / leadStats.total) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-sm text-green-600">↗ 2.1% from last month</p>
                    </div>
                    <div className="bg-green-50 rounded-full p-3">
                      <ChartLine className="text-xl text-green-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Investors</p>
                      <p className="text-3xl font-bold text-navy">{investmentStats?.activeInvestors || 0}</p>
                      <p className="text-sm text-green-600">↗ 18% from last month</p>
                    </div>
                    <div className="bg-gold bg-opacity-10 rounded-full p-3">
                      <ChartLine className="text-xl text-gold" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Investment Value</p>
                      <p className="text-3xl font-bold text-navy">
                        R{investmentStats?.totalCurrentValue ? 
                          (investmentStats.totalCurrentValue / 1000000).toFixed(1) + 'M' : 
                          '0'}
                      </p>
                      <p className="text-sm text-green-600">↗ 24% from last year</p>
                    </div>
                    <div className="bg-purple-50 rounded-full p-3">
                      <ChartLine className="text-xl text-purple-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-navy mb-2">New Leads</h3>
                  <p className="text-2xl font-bold text-blue-600">{leadStats?.new || 0}</p>
                  <p className="text-sm text-gray-600">This week</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-navy mb-2">Qualified</h3>
                  <p className="text-2xl font-bold text-yellow-600">{leadStats?.qualified || 0}</p>
                  <p className="text-sm text-gray-600">In review</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-navy mb-2">Consultation</h3>
                  <p className="text-2xl font-bold text-orange-600">{leadStats?.consultation || 0}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-navy mb-2">Closed</h3>
                  <p className="text-2xl font-bold text-green-600">{leadStats?.closed || 0}</p>
                  <p className="text-sm text-gray-600">This month</p>
                </CardContent>
              </Card>
              </div>
            </div>
          )}

          {activeTab === "crm" && <CRMDashboard />}
          {activeTab === "email" && <EmailAutomation />}
          {activeTab === "booking" && <BookingSystem />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
        </div>
      </div>
    </div>
  );
}
