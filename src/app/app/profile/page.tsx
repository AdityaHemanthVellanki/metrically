"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppNavbar } from "@/components/app-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import azureAIService, { CompanyInfo } from "@/lib/azure-ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Building2,
  Globe,
  TrendingUp,
  BrainCircuit,
  HomeIcon,
  ChevronRight,
  Save,
  AlertTriangle,
  Info
} from "lucide-react";

// Schema for form validation
const startupProfileSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry_sector: z.string().min(1, "Industry sector is required"),
  business_model: z.string().min(1, "Business model is required"),
  customer_segment: z.array(z.string()).min(1, "Select at least one customer segment"),
  geographic_focus: z.string().min(1, "Geographic focus is required"),
  currency_type: z.string().min(1, "Currency type is required"),
  stage: z.string().min(1, "Company stage is required"),
  strategic_focus: z.array(z.string()).min(1, "Select at least one strategic focus"),
  custom_prompt: z.string().min(10, "Please provide some detailed context about your company")
});

type StartupProfileFormData = z.infer<typeof startupProfileSchema>;

// Define form options for dropdowns
const INDUSTRY_SECTORS = [
  "SaaS",
  "E-commerce",
  "Healthcare",
  "Fintech",
  "Manufacturing",
  "Web3",
  "Education",
  "Travel",
  "Food & Beverage",
  "Media & Entertainment",
  "Real Estate",
  "Energy",
  "Transportation",
  "Gaming",
  "AI & ML",
  "Hardware",
  "Cybersecurity",
  "Other"
];

const BUSINESS_MODELS = [
  "Subscription",
  "Transactional",
  "Marketplace",
  "Freemium",
  "API-first",
  "Advertising",
  "Licensing",
  "Open Source",
  "Consulting",
  "Hardware",
  "Other"
];

const CUSTOMER_SEGMENTS = [
  "B2B",
  "B2C",
  "D2C",
  "Government",
  "Internal"
];

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "AUD",
  "CAD",
  "CNY",
  "AED",
  "SGD",
  "BTC",
  "ETH",
  "Other"
];

const COMPANY_STAGES = [
  "Idea Stage",
  "Pre-Revenue",
  "Seed",
  "Series A",
  "Series B",
  "Growth",
  "Mature"
];

const STRATEGIC_FOCUS_OPTIONS = [
  "Growth",
  "Retention",
  "Efficiency",
  "Market Expansion",
  "Profitability",
  "Fundraising",
  "Product Innovation",
  "Team Building"
];

// Create a client-only wrapper component to prevent hydration errors
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  return <>{children}</>;
};

function StartupProfilePageInner() {
  // Client-side only state to prevent hydration issues
  const [isClient, setIsClient] = useState(false);
  
  // Initialize all state that depends on client-side APIs
  const [showToaster, setShowToaster] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Set client flag and initialize client-side only code
  useEffect(() => {
    setIsClient(true);
    setShowToaster(true);
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields }
  } = useForm<StartupProfileFormData>({
    resolver: zodResolver(startupProfileSchema),
    defaultValues: {
      company_name: "",
      industry_sector: "",
      business_model: "",
      customer_segment: [],
      geographic_focus: "",
      currency_type: "",
      stage: "",
      strategic_focus: [],
      custom_prompt: ""
    }
  });

  const formValues = watch();

  // Set a timeout to prevent getting stuck in loading state
  useEffect(() => {
    if (loading) {
      const loadingTimeout = setTimeout(() => {
        console.log('Loading timeout reached, forcing profile display');
        setLoading(false);
        setError('Loading took too long. You can still create or edit your profile.');
      }, 5000); // 5 second maximum loading time
      
      return () => clearTimeout(loadingTimeout);
    }
  }, [loading]);

  // Fetch profile data when user is authenticated
  useEffect(() => {
    if (authLoading) return; // Still checking auth status
    
    if (!user || !supabase) {
      // Not logged in or no database connection, don't leave user stuck in loading
      setLoading(false);
      if (!user) {
        // User not logged in
        return;
      }
      if (!supabase) {
        setError('Database connection unavailable. Try again later.');
        return;
      }
    }
    
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching profile for user:', user.id);
        const { data, error } = await supabase!
          .from('startup_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found for this user - this is expected for new users
            console.log('No existing profile found');
            setHasExistingProfile(false);
          } else {
            // Log error but don't block the form
            console.error('Database error:', error);
            setError(`Unable to fetch existing profile: ${error.message}. You can still create a new profile.`);
          }
        } else if (data) {
          console.log('Found existing profile:', data.startup_id);
          setHasExistingProfile(true);
          setProfileId(data.startup_id);
          // Reset form with existing data
          reset({
            company_name: data.company_name || "",
            industry_sector: data.industry_sector || "",
            business_model: data.business_model || "",
            customer_segment: data.customer_segment || [],
            geographic_focus: data.geographic_focus || "",
            currency_type: data.currency_type || "",
            stage: data.stage || "",
            strategic_focus: data.strategic_focus || [],
            custom_prompt: data.custom_prompt || ""
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        // Show error but don't block form access
        setError(`Error loading profile: ${err.message || 'Unknown error'}. You can still use the form.`);
      } finally {
        // Always ensure loading state is cleared
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authLoading, user, supabase, reset]);

  useEffect(() => {
    if (!isDirty || !user || !hasExistingProfile || !profileId) return;
    let autosaveTimer: NodeJS.Timeout;
    if (isDirty) {
      autosaveTimer = setTimeout(() => {
        handleAutosave();
      }, 30000); // 30 seconds
    }
    return () => {
      if (autosaveTimer) clearTimeout(autosaveTimer);
    };
  }, [formValues, isDirty, user, hasExistingProfile, profileId]);

  const handleAutosave = async () => {
    if (!isDirty || !user || !hasExistingProfile || !profileId) return;
    setIsAutosaving(true);
    try {
      const { error } = await supabase!
        .from('startup_profiles')
        .update({
          ...formValues,
          updated_at: new Date().toISOString()
        })
        .eq('startup_id', profileId);
      
      if (error) throw error;
      setLastSaved(new Date());
    } catch (err: any) {
      console.error('Error autosaving profile:', err);
      // Silently fail on autosave
    } finally {
      setIsAutosaving(false);
    }
  };

  const generateKPIs = async (profileData: StartupProfileFormData) => {
    try {
      // Prepare company info for KPI generation
      const companyInfo: CompanyInfo = {
        product_type: profileData.industry_sector,
        company_stage: profileData.stage,
        tech_stack: "PostgreSQL", // Default to PostgreSQL for now
        industry: profileData.industry_sector,
        business_model: profileData.business_model,
        strategic_focus: profileData.strategic_focus,
        custom_prompt: profileData.custom_prompt
      };
      
      // Check if Azure OpenAI service is available
      const status = await azureAIService.checkStatus();
      
      if (!status.available) {
        console.warn('Azure OpenAI service is not available. Skipping KPI generation.');
        return;
      }
      
      // Generate KPIs using Azure OpenAI
      toast.info('Generating KPIs based on your profile...', { autoClose: false, toastId: 'generating-kpis' });
      
      const response = await azureAIService.generateKPISystem(companyInfo);
      
      if (response.success && response.content) {
        // Save generated KPIs to the database
        const { error } = await supabase!
          .from('generated_kpis')
          .insert([{
            user_id: user!.id,
            startup_id: profileId,
            metrics: response.content.metrics,
            dashboard_recommendations: response.content.dashboard_recommendations,
            summary: response.content.summary,
            created_at: new Date().toISOString()
          }]);
          
        if (error) {
          console.error('Error saving generated KPIs:', error);
          toast.update('generating-kpis', { 
            render: 'KPIs generated but not saved. Please try again later.',
            type: 'warning',
            autoClose: 5000
          });
        } else {
          toast.update('generating-kpis', { 
            render: 'KPIs generated successfully! View them in your dashboard.',
            type: 'success',
            autoClose: 5000
          });
        }
      } else {
        console.error('Failed to generate KPIs:', response.error);
        toast.update('generating-kpis', { 
          render: 'Failed to generate KPIs. Please try again later.',
          type: 'error',
          autoClose: 5000
        });
      }
    } catch (err: any) {
      console.error('Error in KPI generation process:', err);
      toast.update('generating-kpis', { 
        render: 'An error occurred during KPI generation.',
        type: 'error',
        autoClose: 5000
      });
    }
  };

  const onSubmit = async (data: StartupProfileFormData) => {
    if (!user || !supabase) return;
    setSaving(true);
    
    try {
      if (hasExistingProfile && profileId) {
        // Update existing profile
        const { error } = await supabase
          .from('startup_profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('startup_id', profileId);
        
        if (error) throw error;
        toast.success('Profile updated successfully!');
        
        // Generate KPIs after profile update
        await generateKPIs(data);
      } else {
        // Create new profile
        const { data: newProfile, error } = await supabase
          .from('startup_profiles')
          .insert([{
            user_id: user.id,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select('startup_id')
          .single();
        
        if (error) throw error;
        
        // Set profile ID for KPI generation
        if (newProfile) {
          setProfileId(newProfile.startup_id);
        }
        
        toast.success('Profile created successfully!');
        
        // Generate KPIs after profile creation
        await generateKPIs(data);
        
        // Navigate to dashboard after a short delay to allow KPI generation to start
        setTimeout(() => {
          router.push('/app/dashboard');
        }, 1500);
      }
      setLastSaved(new Date());
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast.error(err.message || 'Failed to save your profile');
    } finally {
      setSaving(false);
    }
  };

  // Retry loading profile
  const handleRetry = () => {
    if (authLoading || !user || !supabase) return;
    
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase!
          .from('startup_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found for this user
            setHasExistingProfile(false);
          } else {
            throw error;
          }
        } else if (data) {
          setHasExistingProfile(true);
          setProfileId(data.startup_id);
          // Reset form with existing data
          reset({
            company_name: data.company_name || "",
            industry_sector: data.industry_sector || "",
            business_model: data.business_model || "",
            customer_segment: data.customer_segment || [],
            geographic_focus: data.geographic_focus || "",
            currency_type: data.currency_type || "",
            stage: data.stage || "",
            strategic_focus: data.strategic_focus || [],
            custom_prompt: data.custom_prompt || ""
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };
    
    // Re-fetch profile
    fetchProfileData();
  };

  // Custom multi-select component for customer segments and strategic focus
  const MultiSelect = ({ 
    options, 
    value, 
    onChange,
    error
  }: { 
    options: string[]; 
    value: string[]; 
    onChange: (values: string[]) => void; 
    error?: string;
  }) => {
    const toggleOption = (option: string) => {
      if (value.includes(option)) {
        onChange(value.filter(item => item !== option));
      } else {
        onChange([...value, option]);
      }
    };
    
    return (
      <div>
        <div className="flex flex-wrap gap-2 mt-1">
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                value.includes(option)
                  ? "bg-primary text-white"
                  : "bg-[#222222] text-[#AAAAAA] hover:bg-[#333333]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
      </div>
    );
  };

  // Set loading to false once component mounts on client
  useEffect(() => {
    setLoading(false);
  }, []);

 // Don't render anything until we're on the client to prevent hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-[#121212]">
        <AppNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <AppNavbar />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        {/* Floating save button for desktop */}
        <div className="hidden md:flex fixed top-6 right-8 z-50">
          <Button
            type="submit"
            form="startup-profile-form"
            className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white font-medium px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Profile
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center text-sm mb-6 text-[#AAAAAA]">
          <Link href="/app/dashboard" className="flex items-center hover:text-white transition-colors">
            <HomeIcon className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-white">Startup Profile</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Startup Profile</h1>
          <p className="text-[#AAAAAA] mt-2">Tell us about your startup so we can generate relevant KPIs and dashboards</p>
        </div>

        {/* Loading indicator - shows at the top but doesn't block the form */}
        {loading && (
          <div suppressHydrationWarning className="flex flex-col items-center justify-center py-6 mb-6">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#AAAAAA]">Loading your profile...</p>
          </div>
        )}
        
        {/* Error message - dismissible notification */}
        {error && (
          <div className="bg-red-500/10 border border-[#333333] rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-4 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Note</h3>
                  <button 
                    onClick={() => setError(null)} 
                    className="text-[#AAAAAA] hover:text-white"
                    aria-label="Dismiss"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-[#AAAAAA] mb-3">{error}</p>
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Form - Always visible */}
        <div className="flex flex-col items-center justify-center py-12">
              {showToaster && <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />}
            </div>

            <form id="startup-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Basics */}
            <Card className="overflow-hidden border border-[#232323] bg-[#1E1E1E] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-sans">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Company Basics</span>
                </CardTitle>
                <CardDescription className="text-[#AAAAAA]">Tell us about your company's core information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="company_name" className="block text-base font-medium mb-1">Company Name <span className="text-red-500">*</span></label>
                  <Controller
                    name="company_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="company_name"
                        aria-label="Company Name"
                        className={`bg-[#222222] border border-[#FFFFFF1A] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 rounded-md px-4 py-3 text-base transition-colors ${errors.company_name ? "border-red-500" : ""}`}
                        placeholder="Enter your company name"
                      />
                    )}
                  />
                  {errors.company_name && <p className="text-red-500 text-xs mt-1" role="alert">{errors.company_name.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="industry_sector" className="block text-base font-medium mb-1">Industry Sector <span className="text-red-500">*</span></label>
                    <Controller
                      name="industry_sector"
                      control={control}
                      render={({ field }) => (
                        <div className={`w-full ${errors.industry_sector ? "border-red-500" : ""}`}>
                          <Select className="w-full" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full bg-[#222222] border border-[#FFFFFF1A] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 px-4 py-3 text-base transition-colors">
                              <SelectValue placeholder="Select industry..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] text-white border border-[#333333]">
                              {INDUSTRY_SECTORS.map(industry => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.industry_sector && <p className="text-red-500 text-xs mt-1" role="alert">{errors.industry_sector.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="business_model" className="block text-base font-medium mb-1">Business Model <span className="text-red-500">*</span></label>
                    <Controller
                      name="business_model"
                      control={control}
                      render={({ field }) => (
                        <div className={`w-full ${errors.business_model ? "border-red-500" : ""}`}>
                          <Select className="w-full" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full bg-[#222222] border border-[#FFFFFF1A] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 px-4 py-3 text-base transition-colors">
                              <SelectValue placeholder="Select business model..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] text-white border border-[#333333]">
                              {BUSINESS_MODELS.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.business_model && <p className="text-red-500 text-xs mt-1" role="alert">{errors.business_model.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Divider */}
            <div className="h-px bg-[#232323] my-4" aria-hidden="true" />

            {/* Market Context */}
            <Card className="overflow-hidden border border-[#232323] bg-[#1E1E1E] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-sans">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Market Context</span>
                </CardTitle>
                <CardDescription className="text-[#AAAAAA]">Information about your target market and customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-base font-medium mb-1">Customer Segments <span className="text-red-500">*</span></label>
                  <Controller
                    name="customer_segment"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        options={CUSTOMER_SEGMENTS}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.customer_segment?.message}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="geographic_focus" className="block text-base font-medium mb-1">Geographic Focus <span className="text-red-500">*</span></label>
                    <Controller
                      name="geographic_focus"
                      control={control}
                      render={({ field }) => (
                        <div className={`w-full ${errors.geographic_focus ? "border-red-500" : ""}`}>
                          <Select className="w-full" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full bg-[#222222] border border-[#FFFFFF1A] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 px-4 py-3 text-base transition-colors">
                              <SelectValue placeholder="Select region..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] text-white border border-[#333333]">
                              <SelectItem value="Global">Global</SelectItem>
                              <SelectItem value="North America">North America</SelectItem>
                              <SelectItem value="Europe">Europe</SelectItem>
                              <SelectItem value="Asia">Asia</SelectItem>
                              <SelectItem value="Latin America">Latin America</SelectItem>
                              <SelectItem value="Africa">Africa</SelectItem>
                              <SelectItem value="Middle East">Middle East</SelectItem>
                              <SelectItem value="Oceania">Oceania</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.geographic_focus && <p className="text-red-500 text-xs mt-1" role="alert">{errors.geographic_focus.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="currency_type" className="block text-base font-medium mb-1">Currency Type <span className="text-red-500">*</span></label>
                    <Controller
                      name="currency_type"
                      control={control}
                      render={({ field }) => (
                        <div className={`w-full ${errors.currency_type ? "border-red-500" : ""}`}>
                          <Select className="w-full" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full bg-[#222222] border border-[#FFFFFF1A] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 px-4 py-3 text-base transition-colors">
                              <SelectValue placeholder="Select currency..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] text-white border border-[#333333]">
                              {CURRENCIES.map(currency => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.currency_type && <p className="text-red-500 text-xs mt-1" role="alert">{errors.currency_type.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Divider */}
            <div className="h-px bg-[#232323] my-4" aria-hidden="true" />

            {/* Growth Context */}
            <Card className="overflow-hidden border border-[#232323] bg-[#1E1E1E] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-sans">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Growth Context</span>
                </CardTitle>
                <CardDescription className="text-[#AAAAAA]">Details about your company's growth stage and focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stage" className="block text-base font-medium mb-1">Stage of Company <span className="text-red-500">*</span></label>
                    <Controller
                      name="stage"
                      control={control}
                      render={({ field }) => (
                        <div className={`w-full ${errors.stage ? "border-red-500" : ""}`}>
                          <Select className="w-full" onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full bg-[#222222] border border-[#FFFFFF1A] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 px-4 py-3 text-base transition-colors">
                              <SelectValue placeholder="Select company stage..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#222222] text-white border border-[#333333]">
                              {COMPANY_STAGES.map(stage => (
                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.stage && <p className="text-red-500 text-xs mt-1" role="alert">{errors.stage.message}</p>}
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1">Strategic Focus <span className="text-red-500">*</span></label>
                    <div>
                      <Controller
                        name="strategic_focus"
                        control={control}
                        render={({ field }) => (
                          <MultiSelect
                            options={STRATEGIC_FOCUS_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.strategic_focus?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Divider */}
            <div className="h-px bg-[#232323] my-4" aria-hidden="true" />

            {/* Deep Company Context */}
            <Card className="overflow-hidden border border-[#232323] bg-[#1E1E1E] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-sans">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span>Deep Company Context</span>
                </CardTitle>
                <CardDescription className="text-[#AAAAAA]">Help us understand your company's specific needs and challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-1">
                    <label htmlFor="custom_prompt" className="block text-base font-medium mb-1">Custom Company Prompt <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <Info className="h-4 w-4 text-[#AAAAAA] cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-black/80 rounded text-xs w-60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        This helps our AI understand your specific business needs to generate better KPIs and dashboards
                      </div>
                    </div>
                  </div>
                  <Controller
                    name="custom_prompt"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="custom_prompt"
                        aria-label="Custom Company Prompt"
                        className={`bg-[#222222] border border-[#FFFFFF1A] min-h-[150px] text-white placeholder-[#AAAAAA] focus:ring-2 focus:ring-primary focus:border-primary/50 rounded-md px-4 py-3 text-base transition-colors ${errors.custom_prompt ? "border-red-500" : ""}`}
                        placeholder="Describe your company's specific goals, challenges, and what metrics matter most to you. This helps our AI customize your dashboards and KPIs."
                      />
                    )}
                  />
                  {errors.custom_prompt && <p className="text-red-500 text-xs mt-1" role="alert">{errors.custom_prompt.message}</p>}
                </div>
              </CardContent>
            </Card>
            {/* Mobile floating save button */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
              <Button
                type="submit"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 shadow-lg p-0 flex items-center justify-center"
                disabled={saving}
                aria-label="Save changes"
              >
                {saving ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-6 w-6" />
                )}
              </Button>
            </div>
          </form>
      </main>
    </div>
  );
}

// Export the component as the default export for Next.js
export default StartupProfilePageInner;
