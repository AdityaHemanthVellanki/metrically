import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Sparkles, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient, KPIGenerationRequest, KPIGenerationResponse } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';

// Form schema validation
const formSchema = z.object({
  input_type: z.enum(['guided', 'prompt']).default('guided'),
  // Guided input fields
  product_type: z.string().default(''),
  company_stage: z.string().default(''),
  tech_stack: z.string().default(''),
  industry: z.string().default(''),
  business_model: z.string().default(''),
  target_audience: z.string().default(''),
  // Prompt input field
  startup_description: z.string().default(''),
}).refine(data => {
  // If using guided input, require the essential fields
  if (data.input_type === 'guided') {
    return !!data.product_type && !!data.company_stage && !!data.tech_stack;
  }
  // If using prompt input, require the startup description
  return !!data.startup_description && data.startup_description.length >= 20;
}, {
  message: "Please fill in all required fields based on your selected input method",
  path: ["input_type"], // This will show the error at the input_type field
});

// Define the type for our form data
type FormData = z.infer<typeof formSchema>;

// Props for the component
interface KPIGeneratorFormProps {
  onKPIGenerated: (response: KPIGenerationResponse) => void;
}

export function KPIGeneratorForm({ onKPIGenerated }: KPIGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'guided' | 'prompt'>('guided');
  
  // Define form with validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input_type: 'guided',
      product_type: '',
      company_stage: '',
      tech_stack: '',
      industry: '',
      business_model: '',
      target_audience: '',
      startup_description: '',
    },
  });

  // Handle tab change
  const handleTabChange = (value: 'guided' | 'prompt') => {
    setActiveTab(value);
    form.setValue('input_type', value);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        toast.error('Please login to generate KPIs');
        setIsLoading(false);
        return;
      }
      
      // Create request payload based on input type
      let request: KPIGenerationRequest;
      
      if (values.input_type === 'guided') {
        // Guided input
        request = {
          product_type: values.product_type || '',
          company_stage: values.company_stage || '',
          tech_stack: values.tech_stack || '',
        };
        
        // Add optional fields if provided
        if (values.industry) request.industry = values.industry;
        if (values.business_model) request.business_model = values.business_model;
        if (values.target_audience) request.target_audience = values.target_audience;
      } else {
        // Prompt input (free-form description)
        request = {
          startup_description: values.startup_description,
          // Add minimal required fields with placeholder values if needed by the API
          product_type: 'Custom',
          company_stage: 'Custom',
          tech_stack: 'Custom',
        };
      }
      
      // Call API
      const response = await apiClient.generateKPI(request);
      
      if ('error' in response) {
        toast.error(response.error);
      } else {
        toast.success('KPI system generated successfully!');
        onKPIGenerated(response);
      }
    } catch (error) {
      console.error('Error generating KPIs:', error);
      toast.error('Failed to generate KPI system. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 gradient-text">Generate Your KPI System</h2>
      <p className="text-muted-foreground mb-6">Choose how you want to generate KPIs for your startup</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
          <Tabs
            defaultValue="guided"
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as 'guided' | 'prompt')}
            className="w-full mb-6"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="guided" className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Guided Setup
              </TabsTrigger>
              <TabsTrigger value="prompt" className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Describe Your Startup
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="guided" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Type */}
                <FormField
                  control={form.control}
                  name="product_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                          <SelectItem value="Enterprise Software">Enterprise Software</SelectItem>
                          <SelectItem value="Consumer Product">Consumer Product</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        What type of product are you building?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Company Stage */}
                <FormField
                  control={form.control}
                  name="company_stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Stage</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Series C+">Series C+</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        What stage is your company at?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Technology Stack */}
                <FormField
                  control={form.control}
                  name="tech_stack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Stack</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="PostgreSQL, Firebase, etc." 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        What technologies do you use for data storage?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Industry */}
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Fintech, Healthcare, etc." 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        What industry does your product serve?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Model */}
                <FormField
                  control={form.control}
                  name="business_model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Model (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Subscription, Freemium, etc." 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        How do you monetize your product?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Audience */}
                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="SMBs, Enterprise, Consumers, etc." 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Who are your primary users?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="prompt" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="startup_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-primary" />
                          Describe Your Startup
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your startup, including your product, target market, business model, stage, technology stack, and any other relevant details. The more information you provide, the better KPIs we can generate." 
                            className="min-h-[200px] resize-none"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your startup to generate tailored KPIs (minimum 20 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating KPI System...
              </>
            ) : (
              'Generate KPI System'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
