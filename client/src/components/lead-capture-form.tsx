import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Download, Lock } from "lucide-react";

const leadFormSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  age: z.string().min(1, "Please select your age range"),
  investmentBudget: z.string().min(1, "Please select your investment budget"),
  moneyReadyAvailable: z.string().min(1, "Please indicate if money is readily available"),
  consent: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function LeadCaptureForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
      age: "",
      investmentBudget: "",
      moneyReadyAvailable: "",
      consent: false,
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", {
        firstName: data.firstName,
        email: data.email,
        phone: data.phone || "",
        age: data.age,
        investmentBudget: data.investmentBudget,
        moneyReadyAvailable: data.moneyReadyAvailable,
        leadSource: "website",
        status: "new",
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your free guide has been sent to your email address.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    createLeadMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Download className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-navy mb-2">Thank You!</h3>
        <p className="text-dark-gray mb-4">
          Your free investment guide has been sent to your email address.
        </p>
        <p className="text-sm text-gray-600">
          Check your inbox (and spam folder) for your download link.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-dark-gray">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  data-testid="input-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-dark-gray">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  data-testid="input-email"
                />
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
              <FormLabel className="text-sm font-medium text-dark-gray">Phone (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  data-testid="input-phone"
                />
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
              <FormLabel className="text-sm font-medium text-dark-gray">Age</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" data-testid="select-age">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="18-25">18-25</SelectItem>
                  <SelectItem value="26-35">26-35</SelectItem>
                  <SelectItem value="36-45">36-45</SelectItem>
                  <SelectItem value="46-55">46-55</SelectItem>
                  <SelectItem value="56-65">56-65</SelectItem>
                  <SelectItem value="65+">65+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="investmentBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-dark-gray">Amount Available to Invest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" data-testid="select-investment">
                    <SelectValue placeholder="Select your budget" />
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
          name="moneyReadyAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-dark-gray">Is the money readily available?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" data-testid="select-money-available">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-dark-gray">
                  I agree to receive marketing communications and the{" "}
                  <a href="#" className="text-gold hover:underline">Terms of Service</a>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createLeadMutation.isPending}
          className="w-full bg-gold text-navy px-6 py-4 text-lg font-semibold hover:bg-gold/90 transition-all duration-200 shadow-lg"
          data-testid="button-submit"
        >
          {createLeadMutation.isPending ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-navy border-t-transparent rounded-full mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Download className="mr-2" size={20} />
              Get Instant Access
            </>
          )}
        </Button>

        <p className="text-center text-sm text-gray-500">
          <Lock className="inline mr-1" size={16} />
          Your information is secure and will never be shared.
        </p>
      </form>
    </Form>
  );
}
