import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
import { apiClient, KPIGenerationRequest } from '@/lib/api-client';

// Form schema validation
const formSchema = z.object({
  product_type: z.string().min(2, {
    message: 'Please select a product type.',
  }),
  company_stage: z.string().min(2, {
    message: 'Please select your company stage.',
  }),
  tech_stack: z.string().min(2, {
    message: 'Please enter your tech stack.',
  }),
  industry: z.string().optional(),
});

// Props for the component
interface KPIGeneratorFormProps {
  onKPIGenerated: (response: any) => void;
}

export function KPIGeneratorForm({ onKPIGenerated }: KPIGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Define form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_type: '',
      company_stage: '',
      tech_stack: '',
      industry: '',
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        toast.error('Please login to generate KPIs');
        setIsLoading(false);
        return;
      }
      
      // Create request payload
      const request: KPIGenerationRequest = {
        product_type: values.product_type,
        company_stage: values.company_stage,
        tech_stack: values.tech_stack,
      };
      
      // Add industry if provided
      if (values.industry) {
        request.industry = values.industry;
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
      <h2 className="text-2xl font-semibold mb-6 gradient-text">Generate Your KPI System</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </div>
          
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
