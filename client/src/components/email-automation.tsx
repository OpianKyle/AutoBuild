import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Mail, Eye, Edit, BarChart3, Pause } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EmailStats, EmailSequence } from "@shared/schema";

export default function EmailAutomation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    triggerEvent: "lead_capture"
  });

  const { data: emailStats } = useQuery<EmailStats>({
    queryKey: ["/api/analytics/emails"],
  });

  const { data: sequences = [] } = useQuery<EmailSequence[]>({
    queryKey: ["/api/email-sequences"],
  });

  const createSequenceMutation = useMutation({
    mutationFn: async (sequenceData: any) => {
      await apiRequest("POST", "/api/email-sequences", sequenceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-sequences"] });
      setShowCreateDialog(false);
      setFormData({ name: "", description: "", triggerEvent: "lead_capture" });
      toast({
        title: "Success",
        description: "Email sequence created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create email sequence",
        variant: "destructive",
      });
    },
  });

  const handleCreateSequence = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please provide a sequence name",
        variant: "destructive",
      });
      return;
    }
    createSequenceMutation.mutate(formData);
  };

  // Mock email sequences data for demonstration
  const mockSequences = [
    {
      id: "1",
      name: "Welcome Series",
      description: "7-email sequence for new leads",
      isActive: true,
      subscribers: 1247,
      openRate: 22.4,
      clickRate: 5.8,
      conversionRate: 2.3,
    },
    {
      id: "2", 
      name: "Investment Education",
      description: "5-email sequence about private equity basics",
      isActive: true,
      subscribers: 892,
      openRate: 28.1,
      clickRate: 7.2,
      conversionRate: 3.1,
    },
  ];

  // Mock email templates
  const mockTemplates = [
    {
      id: "1",
      name: "Welcome Email",
      preview: "Thank you for downloading our guide...",
      usage: 247,
    },
    {
      id: "2",
      name: "Case Study",
      preview: "See how R50k grew to R150k in 3 years...",
      usage: 189,
    },
    {
      id: "3",
      name: "Webinar Invite", 
      preview: "Join our free webinar on private equity...",
      usage: 156,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-navy mb-2">Email Automation</h2>
          <p className="text-dark-gray">Manage automated email sequences and campaigns</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-navy hover:bg-gold/90">
              <Plus className="mr-2" size={16} />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Email Sequence</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sequenceName">Sequence Name *</Label>
                <Input
                  id="sequenceName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Welcome Series"
                />
              </div>
              <div>
                <Label htmlFor="sequenceDescription">Description</Label>
                <Textarea
                  id="sequenceDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this email sequence..."
                />
              </div>
              <div>
                <Label htmlFor="triggerEvent">Trigger Event</Label>
                <Select value={formData.triggerEvent} onValueChange={(value) => setFormData(prev => ({ ...prev, triggerEvent: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead_capture">Lead Capture</SelectItem>
                    <SelectItem value="consultation_booked">Consultation Booked</SelectItem>
                    <SelectItem value="investment_completed">Investment Completed</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleCreateSequence}
                  disabled={createSequenceMutation.isPending}
                  className="flex-1 bg-gold text-navy hover:bg-gold/90"
                >
                  {createSequenceMutation.isPending ? "Creating..." : "Create Sequence"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-3xl font-bold text-navy">
                  {emailStats?.openRate ? emailStats.openRate.toFixed(1) : '24.8'}%
                </p>
                <p className="text-sm text-green-600">↗ 3.2% improvement</p>
              </div>
              <div className="bg-blue-50 rounded-full p-3">
                <Mail className="text-xl text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-3xl font-bold text-navy">
                  {emailStats?.clickRate ? emailStats.clickRate.toFixed(1) : '6.2'}%
                </p>
                <p className="text-sm text-green-600">↗ 1.1% improvement</p>
              </div>
              <div className="bg-green-50 rounded-full p-3">
                <BarChart3 className="text-xl text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-3xl font-bold text-navy">
                  {emailStats?.totalSent ? emailStats.totalSent.toLocaleString() : '12,450'}
                </p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <div className="bg-gold bg-opacity-10 rounded-full p-3">
                <Mail className="text-xl text-gold" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Active Email Sequences</CardTitle>
        </CardHeader>
        <CardContent>
          {mockSequences.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Email Sequences</h3>
              <p className="text-gray-500">Create your first email sequence to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockSequences.map((sequence) => (
                <Card key={sequence.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-navy mb-1">{sequence.name}</h4>
                        <p className="text-sm text-gray-600">{sequence.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={sequence.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {sequence.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-navy">{sequence.subscribers.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Subscribers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-navy">{sequence.openRate}%</p>
                        <p className="text-xs text-gray-600">Open Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-navy">{sequence.clickRate}%</p>
                        <p className="text-xs text-gray-600">Click Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-navy">{sequence.conversionRate}%</p>
                        <p className="text-xs text-gray-600">Conversion</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1" size={16} />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-gold hover:text-gold">
                          <BarChart3 className="mr-1" size={16} />
                          Analytics
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                        <Pause className="mr-1" size={16} />
                        Pause
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="bg-gray-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                    <Mail className="text-3xl text-gray-400" size={48} />
                  </div>
                  <h4 className="font-semibold text-navy mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{template.preview}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Used {template.usage} times</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gold hover:text-gold">
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
