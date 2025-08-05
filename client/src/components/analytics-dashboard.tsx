import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Download, Calendar, DollarSign, ArrowDown, TrendingUp, Mail, MousePointer } from "lucide-react";
import { LeadStats, InvestmentStats, EmailStats } from "@shared/schema";

export default function AnalyticsDashboard() {
  const { data: leadStats } = useQuery<LeadStats>({
    queryKey: ["/api/analytics/leads"],
  });

  const { data: investmentStats } = useQuery<InvestmentStats>({
    queryKey: ["/api/analytics/investments"],
  });

  const { data: emailStats } = useQuery<EmailStats>({
    queryKey: ["/api/analytics/emails"],
  });

  // Mock funnel data
  const funnelStages = [
    {
      icon: Users,
      title: "Website Visitors",
      description: "Unique visitors this month",
      value: "15,247",
      change: "+8.2%",
      color: "blue",
    },
    {
      icon: Download,
      title: "Guide Downloads",
      description: "Lead capture conversions",
      value: leadStats?.total?.toString() || "1,247",
      conversion: "8.2% conversion",
      color: "green",
    },
    {
      icon: Calendar,
      title: "Consultations Booked",
      description: "Meeting scheduling rate",
      value: "312",
      conversion: "25.0% of leads",
      color: "yellow",
    },
    {
      icon: DollarSign,
      title: "Investments Closed",
      description: "Completed transactions",
      value: leadStats?.closed?.toString() || "89",
      conversion: "28.5% close rate",
      color: "gold",
    },
  ];

  // Mock email campaign performance
  const emailCampaigns = [
    {
      name: "Welcome Series",
      recipients: 1247,
      openRate: 24.8,
      clickRate: 6.2,
    },
    {
      name: "Investment Education",
      recipients: 892,
      openRate: 28.1,
      clickRate: 7.2,
    },
    {
      name: "Quarterly Updates",
      recipients: 342,
      openRate: 42.3,
      clickRate: 12.8,
    },
  ];

  // Mock lead quality metrics
  const leadQualityMetrics = [
    { label: "Average Lead Score", value: "76.2" },
    { label: "High-Quality Leads", value: "34.8%" },
    { label: "Average Time to Convert", value: "12.4 days" },
    { label: "Lead to Customer Rate", value: "7.1%" },
    { label: "Average Deal Size", value: "R68,500" },
    { label: "Customer Lifetime Value", value: "R142,300" },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600", 
      yellow: "bg-yellow-50 text-yellow-600",
      gold: "bg-gold bg-opacity-10 text-gold",
    };
    return colors[color as keyof typeof colors] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-playfair font-bold text-navy mb-2">Analytics & Performance</h2>
        <p className="text-dark-gray">Track funnel performance and conversion metrics</p>
      </div>

      {/* Funnel Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Sales Funnel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {funnelStages.map((stage, index) => (
              <div key={stage.title}>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-full p-3 ${getColorClasses(stage.color)}`}>
                      <stage.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy">{stage.title}</h4>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-navy">{stage.value}</p>
                    {stage.change && (
                      <p className="text-sm text-green-600">↗ {stage.change}</p>
                    )}
                    {stage.conversion && (
                      <p className="text-sm text-gold">{stage.conversion}</p>
                    )}
                  </div>
                </div>
                
                {index < funnelStages.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <ArrowDown className="text-gray-500" size={16} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy">Monthly Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Conversion Chart</h3>
              <p className="text-gray-500">Interactive charts coming soon</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Traffic Analytics</h3>
              <p className="text-gray-500">Source breakdown coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy">Email Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailCampaigns.map((campaign) => (
                <div key={campaign.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-navy">{campaign.name}</p>
                    <p className="text-sm text-gray-600">{campaign.recipients.toLocaleString()} recipients</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Mail size={16} className="mx-auto text-blue-600 mb-1" />
                        <p className="text-sm font-medium text-navy">{campaign.openRate}%</p>
                        <p className="text-xs text-gray-600">open</p>
                      </div>
                      <div className="text-center">
                        <MousePointer size={16} className="mx-auto text-green-600 mb-1" />
                        <p className="text-sm font-medium text-navy">{campaign.clickRate}%</p>
                        <p className="text-xs text-gray-600">click</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy">Lead Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadQualityMetrics.map((metric) => (
                <div key={metric.label} className="flex justify-between items-center">
                  <span className="text-gray-600">{metric.label}</span>
                  <span className="font-semibold text-navy">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
