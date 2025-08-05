import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartLine, LogOut, Wallet, TrendingUp, FileText, Download } from "lucide-react";
import { Investment } from "@shared/schema";

export default function InvestorPortal() {
  const { user } = useAuth();

  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  // Calculate portfolio metrics
  const totalInvestment = investments.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.currentValue || inv.amount || "0"), 0);
  const totalReturn = totalInvestment > 0 ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-playfair font-bold text-navy mr-8">
                <ChartLine className="inline-block text-gold mr-2" size={20} />
                PE Capital - Investor Portal
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-dark-gray">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                )}
                <span className="font-medium">
                  {user?.firstName || "Investor"}
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
      </nav>

      {/* Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-playfair font-bold text-navy mb-2">Investment Portfolio</h2>
          <p className="text-dark-gray">Track your private equity investments and performance</p>
        </div>
        
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-3xl font-bold text-navy">R{totalInvestment.toLocaleString()}</p>
                  <p className="text-sm text-blue-600">{investments.length} active investments</p>
                </div>
                <div className="bg-blue-50 rounded-full p-3">
                  <Wallet className="text-xl text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Value</p>
                  <p className="text-3xl font-bold text-navy">R{totalCurrentValue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">↗ R{(totalCurrentValue - totalInvestment).toLocaleString()} gain</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Return</p>
                  <p className="text-3xl font-bold text-navy">{totalReturn.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Since inception</p>
                </div>
                <div className="bg-gold bg-opacity-10 rounded-full p-3">
                  <TrendingUp className="text-xl text-gold" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="investments" className="space-y-8">
          <TabsList>
            <TabsTrigger value="investments">Your Investments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="investments">
            {/* Investment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-navy">Your Investments</CardTitle>
              </CardHeader>
              <CardContent>
                {investments.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Investments Yet</h3>
                    <p className="text-gray-500">Contact your advisor to start investing</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {investments.map((investment: any) => (
                      <Card key={investment.id} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-navy mb-1">{investment.fundName}</h4>
                              <p className="text-sm text-gray-600">{investment.fundDescription}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              investment.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {investment.status === 'active' ? 'Active' : investment.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Investment</p>
                              <p className="text-lg font-semibold text-navy">R{parseFloat(investment.amount).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Current Value</p>
                              <p className="text-lg font-semibold text-navy">
                                R{parseFloat(investment.currentValue || investment.amount).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Return</p>
                              <p className="text-lg font-semibold text-green-600">
                                +{investment.returnPercentage ? parseFloat(investment.returnPercentage).toFixed(1) : '0.0'}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Investment Date</p>
                              <p className="text-lg font-semibold text-navy">
                                {new Date(investment.investmentDate).toLocaleDateString('en-ZA', {
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                              <Button variant="outline" size="sm">
                                <FileText className="mr-1" size={16} />
                                View Report
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="mr-1" size={16} />
                                Download Statement
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ChartLine className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Performance Analytics</h3>
                  <p className="text-gray-500">Detailed performance charts coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Investment Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Documents Available</h3>
                  <p className="text-gray-500">Investment statements and reports will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
