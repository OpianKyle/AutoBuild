import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarPlus, Calendar, Clock, Users, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BookingSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(15);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "consultation",
    scheduledDate: "",
    scheduledTime: "",
    duration: 30
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const scheduledAt = new Date(`${bookingData.scheduledDate}T${bookingData.scheduledTime}`);
      await apiRequest("POST", "/api/bookings", {
        leadId: null,
        userId: null,
        type: bookingData.type,
        scheduledAt: scheduledAt,
        duration: bookingData.duration,
        status: "scheduled",
        meetingLink: null,
        notes: `${bookingData.firstName} ${bookingData.lastName} - ${bookingData.email} - ${bookingData.phone}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setShowBookingDialog(false);
      setBookingForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        type: "consultation",
        scheduledDate: "",
        scheduledTime: "",
        duration: 30
      });
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleCreateBooking = () => {
    if (!bookingForm.firstName || !bookingForm.email || !bookingForm.scheduledDate || !bookingForm.scheduledTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createBookingMutation.mutate(bookingForm);
  };

  // Mock booking stats
  const bookingStats = {
    todayMeetings: 3,
    weekMeetings: 12,
    pendingMeetings: 7,
    conversionRate: 68,
  };

  // Mock today's meetings
  const todayMeetings = [
    {
      id: "1",
      time: "10:00",
      clientName: "Sarah Williams",
      type: "Investment consultation",
    },
    {
      id: "2", 
      time: "14:00",
      clientName: "Michael Roberts",
      type: "Portfolio review",
    },
    {
      id: "3",
      time: "16:30", 
      clientName: "Lisa Chen",
      type: "New investor meeting",
    },
  ];

  // Generate calendar days (simplified)
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const hasBookings = [15, 17, 22].includes(i);
      const isToday = i === 15;
      days.push({
        day: i,
        hasBookings,
        isToday,
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-navy mb-2">Booking System</h2>
          <p className="text-dark-gray">Manage consultation schedules and availability</p>
        </div>
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-navy hover:bg-gold/90">
              <CalendarPlus className="mr-2" size={16} />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bookingFirstName">First Name *</Label>
                  <Input
                    id="bookingFirstName"
                    value={bookingForm.firstName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="bookingLastName">Last Name</Label>
                  <Input
                    id="bookingLastName"
                    value={bookingForm.lastName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bookingEmail">Email *</Label>
                <Input
                  id="bookingEmail"
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="bookingPhone">Phone</Label>
                <Input
                  id="bookingPhone"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+27 82 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="bookingType">Meeting Type</Label>
                <Select value={bookingForm.type} onValueChange={(value) => setBookingForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Investment Consultation</SelectItem>
                    <SelectItem value="portfolio_review">Portfolio Review</SelectItem>
                    <SelectItem value="follow_up">Follow-up Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bookingDate">Date *</Label>
                  <Input
                    id="bookingDate"
                    type="date"
                    value={bookingForm.scheduledDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="bookingTime">Time *</Label>
                  <Input
                    id="bookingTime"
                    type="time"
                    value={bookingForm.scheduledTime}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bookingDuration">Duration (minutes)</Label>
                <Select value={bookingForm.duration.toString()} onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleCreateBooking}
                  disabled={createBookingMutation.isPending}
                  className="flex-1 bg-gold text-navy hover:bg-gold/90"
                >
                  {createBookingMutation.isPending ? "Booking..." : "Book Appointment"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBookingDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Meetings</p>
                <p className="text-3xl font-bold text-navy">{bookingStats.todayMeetings}</p>
              </div>
              <div className="bg-blue-50 rounded-full p-3">
                <Calendar className="text-xl text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-navy">{bookingStats.weekMeetings}</p>
              </div>
              <div className="bg-green-50 rounded-full p-3">
                <Calendar className="text-xl text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-navy">{bookingStats.pendingMeetings}</p>
              </div>
              <div className="bg-yellow-50 rounded-full p-3">
                <Clock className="text-xl text-yellow-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-navy">{bookingStats.conversionRate}%</p>
              </div>
              <div className="bg-gold bg-opacity-10 rounded-full p-3">
                <Users className="text-xl text-gold" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-navy">January 2024</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for month start */}
                <div className="p-2 text-gray-400">31</div>
                
                {/* Calendar days */}
                {calendarDays.map(({ day, hasBookings, isToday }) => (
                  <div
                    key={day}
                    className={`p-2 text-center cursor-pointer hover:bg-gray-50 ${
                      isToday
                        ? "bg-gold bg-opacity-20 border-2 border-gold rounded"
                        : hasBookings
                        ? "bg-blue-50 border border-blue-200 rounded"
                        : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gold bg-opacity-20 border-2 border-gold rounded mr-2" />
                  <span className="text-gray-600">Today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2" />
                  <span className="text-gray-600">Has Meetings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Today's Schedule & Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-navy">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todayMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">No meetings scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-gold text-navy px-3 py-1 rounded-lg text-sm font-semibold">
                        {meeting.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-navy">{meeting.clientName}</p>
                        <p className="text-sm text-gray-600">{meeting.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                        <Video size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-navy">Booking Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Meeting Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Available Hours</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="time" defaultValue="09:00" />
                  <Input type="time" defaultValue="17:00" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="weekends" />
                <Label htmlFor="weekends" className="text-sm text-gray-700">Include weekends</Label>
              </div>
              
              <Button className="w-full bg-navy text-white hover:bg-navy/90">
                Update Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
