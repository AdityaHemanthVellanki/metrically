"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  LineChart, 
  LayoutDashboard, 
  Building2,
  PenSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityType = 'dashboard_created' | 'dashboard_edited' | 'kpi_created' | 'profile_updated';

interface Activity {
  id: string;
  type: ActivityType;
  entityName: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  // Determine the proper icon for each activity type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'dashboard_created':
      case 'dashboard_edited':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'kpi_created':
        return <LineChart className="h-4 w-4" />;
      case 'profile_updated':
        return <Building2 className="h-4 w-4" />;
      default:
        return <PenSquare className="h-4 w-4" />;
    }
  };

  // Get descriptive text for activity type
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'dashboard_created':
        return `Created dashboard "${activity.entityName}"`;
      case 'dashboard_edited':
        return `Updated dashboard "${activity.entityName}"`;
      case 'kpi_created':
        return `Added new KPI "${activity.entityName}"`;
      case 'profile_updated':
        return `Updated startup profile`;
      default:
        return `Activity on "${activity.entityName}"`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activity yet. Start by creating your first dashboard or KPI.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{getActivityText(activity)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
