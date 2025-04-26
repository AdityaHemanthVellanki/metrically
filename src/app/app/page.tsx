"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { AppNavbar } from "@/components/app-navbar";
import { DashboardCard } from "@/components/dashboard-card";
import { ActivityFeed } from "@/components/activity-feed";
import { StartupProfileStatus } from "@/components/startup-profile-status";
import { supabase } from "@/lib/supabase";
import { PlusCircle, LayoutDashboard, LineChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StartupProfile {
  startup_id: string;
  company_name: string;
  industry_sector: string;
  business_model: string;
  customer_segment: string;
  geographic_focus: string;
  currency_type: string;
  stage: string;
  strategic_focus: string[];
  custom_prompt: string;
}

interface Dashboard {
  dashboard_id: string;
  dashboard_name: string;
  last_modified_at: string;
}

interface Activity {
  id: string;
  type: 'dashboard_created' | 'dashboard_edited' | 'kpi_created' | 'profile_updated';
  entityName: string;
  timestamp: Date;
}

export default function AppHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [startupProfile, setStartupProfile] = useState<StartupProfile | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router, mounted]);

  // Fetch user's startup profile and data
  useEffect(() => {
    if (!user || !mounted) return;
    
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch the user's startup profile
        const profileResponse = await supabase
          ?.from('startup_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        const profileData = profileResponse?.data;
        const profileError = profileResponse?.error;
        
        if (profileError) {
          console.error('Error fetching startup profile:', profileError);
        } else if (profileData) {
          setStartupProfile(profileData as StartupProfile);
          
          // Check if profile is complete
          const requiredFields = [
            'company_name', 'industry_sector', 'business_model',
            'customer_segment', 'geographic_focus', 'currency_type',
            'stage', 'strategic_focus', 'custom_prompt'
          ];
          
          const missing = requiredFields.filter(field => {
            if (field === 'strategic_focus') {
              return !profileData[field] || profileData[field].length === 0;
            }
            return !profileData[field];
          });
          
          setMissingFields(missing.map(field => field.replace(/_/g, ' ')));
          setProfileComplete(missing.length === 0);
        }

        // Try to fetch user's dashboards
        const dashboardsResponse = await supabase
          ?.from('custom_dashboards')
          .select('dashboard_id, dashboard_name, last_modified_at')
          .eq('startup_id', profileData?.startup_id || '0')
          .order('last_modified_at', { ascending: false });
          
        const dashboardsData = dashboardsResponse?.data;
        const dashboardsError = dashboardsResponse?.error;
          
        if (dashboardsError) {
          console.error('Error fetching dashboards:', dashboardsError);
        } else {
          setDashboards(dashboardsData as Dashboard[] || []);
        }
        
        // For now, leave activities empty - we'll fetch them later
        // In a real implementation, you would fetch from an activities table
        setActivities([]);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, mounted]);

  if (!mounted) return null;
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading your workspace...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!user) return null;

  // Use company name if available, otherwise use email or a default greeting
  const userName = startupProfile?.company_name || user.email?.split('@')[0] || 'to Metrically';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <AppNavbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="glass p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome back, <span className="text-primary">{userName}</span> 👋
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-8">
              Track your most important metrics and KPIs all in one place. Create custom dashboards, 
              define your own KPIs, and get AI-powered insights for your business.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20" size="lg" asChild>
                <Link href="/app/dashboards/new">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/app/dashboards">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  View Dashboards
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/app/kpis/new">
                  <LineChart className="mr-2 h-5 w-5" />
                  Create New KPI
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard Previews Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
                  Your Dashboards
                </CardTitle>
                <CardDescription>
                  View and manage your custom analytics dashboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboards.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-muted rounded-md">
                    <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No dashboards created yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Click 'Create New Dashboard' to get started
                    </p>
                    <Button asChild>
                      <Link href="/app/dashboards/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dashboards.map((dashboard) => (
                      <DashboardCard
                        key={dashboard.dashboard_id}
                        id={dashboard.dashboard_id}
                        name={dashboard.dashboard_name}
                        lastModified={new Date(dashboard.last_modified_at)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Startup Profile Status */}
            <StartupProfileStatus 
              isComplete={profileComplete} 
              missingFields={missingFields} 
            />
            
            {/* Activity Feed */}
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </main>
    </div>
  );
}
