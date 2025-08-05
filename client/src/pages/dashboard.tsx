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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <ChartLine className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-900">PE Capital</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm text-left rounded-md transition-colors group",
                      activeTab === item.id
                        ? "bg-orange-50 text-orange-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon 
                      size={18} 
                      className={cn(
                        "mr-3 flex-shrink-0",
                        activeTab === item.id ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500"
                      )} 
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center min-w-0">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-gray-700 truncate">
                {user?.firstName || "Admin"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Monitor your sales funnel performance and key metrics</p>
              </div>
            
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Leads</p>
                        <p className="text-2xl font-semibold text-gray-900">{leadStats?.total || 0}</p>
                        <p className="text-xs text-green-600 mt-1">↗ 12% from last month</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="text-blue-600" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {leadStats?.total && leadStats?.closed ? ((leadStats.closed / leadStats.total) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs text-green-600 mt-1">↗ 2.1% from last month</p>
                      </div>
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="text-green-600" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Investors</p>
                        <p className="text-2xl font-semibold text-gray-900">{investmentStats?.activeInvestors || 0}</p>
                        <p className="text-xs text-green-600 mt-1">↗ 18% from last month</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Users className="text-orange-600" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Investment Value</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          R{investmentStats?.totalCurrentValue ? 
                            (investmentStats.totalCurrentValue / 1000000).toFixed(1) + 'M' : 
                            '0'}
                        </p>
                        <p className="text-xs text-green-600 mt-1">↗ 24% from last year</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <ChartLine className="text-purple-600" size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pipeline Overview */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-sm border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">New Leads</h3>
                      <p className="text-xl font-semibold text-gray-900">{leadStats?.new || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">This week</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Qualified</h3>
                      <p className="text-xl font-semibold text-gray-900">{leadStats?.qualified || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">In review</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-sm border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Consultation</h3>
                      <p className="text-xl font-semibold text-gray-900">{leadStats?.consultation || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Scheduled</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Closed</h3>
                      <p className="text-xl font-semibold text-gray-900">{leadStats?.closed || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">This month</p>
                    </CardContent>
                  </Card>
                </div>
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
