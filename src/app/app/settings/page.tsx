"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { AppNavbar } from "@/components/app-navbar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  User, 
  Settings, 
  Bell, 
  Key, 
  Database, 
  Save, 
  Trash2, 
  LogOut,
  CreditCard
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  kpiAlerts: z.boolean().default(true),
  dashboardUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.enum(["30m", "1h", "4h", "1d", "never"]).default("4h"),
});

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Initialize forms
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      jobTitle: "",
      company: "",
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      kpiAlerts: true,
      dashboardUpdates: true,
      marketingEmails: false,
    },
  });

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: false,
      sessionTimeout: "4h",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router, mounted]);

  useEffect(() => {
    if (user && mounted) {
      fetchUserData();
    }
  }, [user, mounted]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } else if (data) {
        setUserData(data);
        
        // Update form default values
        profileForm.reset({
          name: data.full_name || "",
          email: user?.email || "",
          bio: data.bio || "",
          jobTitle: data.job_title || "",
          company: data.company || "",
        });
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.name,
          bio: values.bio,
          job_title: values.jobTitle,
          company: values.company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationsSubmit = async (values: z.infer<typeof notificationsFormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          email_notifications: values.emailNotifications,
          kpi_alerts: values.kpiAlerts,
          dashboard_updates: values.dashboardUpdates,
          marketing_emails: values.marketingEmails,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const onSecuritySubmit = async (values: z.infer<typeof securityFormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_security')
        .upsert({
          user_id: user?.id,
          two_factor_auth: values.twoFactorAuth,
          session_timeout: values.sessionTimeout,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      toast.success('Security settings updated');
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast.error('Failed to update security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        // Delete user data from various tables
        await supabase.from('profiles').delete().eq('id', user?.id);
        await supabase.from('startup_profiles').delete().eq('user_id', user?.id);
        
        // Finally delete the user auth record
        const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
        
        if (error) {
          throw error;
        }

        // Sign out the user
        await signOut();
        router.replace('/');
        toast.success('Your account has been deleted');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  if (!mounted || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container max-w-6xl py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="your.email@example.com"
                                {...field}
                                disabled
                              />
                            </FormControl>
                            <FormDescription>
                              Contact support to change your email address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Your job title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little bit about yourself"
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="mr-2">
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications for important updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="kpiAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>KPI Alerts</FormLabel>
                            <FormDescription>
                              Get notified when KPIs reach thresholds or show significant changes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="dashboardUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>Dashboard Updates</FormLabel>
                            <FormDescription>
                              Receive notifications when dashboards are updated
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive emails about new features, tips, and offers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Preferences
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your security settings and account access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <FormLabel>Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Add an extra layer of security to your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem className="border-b pb-4">
                          <FormLabel>Session Timeout</FormLabel>
                          <FormDescription className="mb-2">
                            Set how long until you're automatically logged out after inactivity
                          </FormDescription>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeout duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30m">30 minutes</SelectItem>
                              <SelectItem value="1h">1 hour</SelectItem>
                              <SelectItem value="4h">4 hours</SelectItem>
                              <SelectItem value="1d">1 day</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Update your password to keep your account secure
                        </p>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated data
                        </p>
                        <div className="flex space-x-4">
                          <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </Button>
                          <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="mt-4">
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Security Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your subscription plan and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <div className="flex items-center mt-2">
                        <div className="text-2xl font-bold text-primary">Free Trial</div>
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          Current
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your trial ends in 14 days on June 7, 2025
                      </p>
                    </div>
                    <Button className="bg-primary">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Available Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Starter</CardTitle>
                        <div className="mt-1">
                          <span className="text-2xl font-bold">$19</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">For small startups and founders</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>5 Custom KPIs</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>2 Dashboards</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Basic Analytics</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Choose Plan
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="border-primary">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Pro</CardTitle>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                            Popular
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-2xl font-bold">$49</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">For growing startups and small teams</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>25 Custom KPIs</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>10 Dashboards</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Advanced Analytics</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Team Collaboration</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          Choose Plan
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Enterprise</CardTitle>
                        <div className="mt-1">
                          <span className="text-2xl font-bold">$199</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm">For established startups and larger teams</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Unlimited KPIs</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Unlimited Dashboards</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Enterprise Analytics</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Priority Support</span>
                          </li>
                          <li className="flex items-center">
                            <div className="mr-2 h-4 w-4 text-primary">✓</div>
                            <span>Custom Integrations</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Choose Plan
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                  <p className="text-muted-foreground mb-4">
                    No payment methods added yet
                  </p>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Billing History</h3>
                  <p className="text-muted-foreground">
                    No billing history available
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
