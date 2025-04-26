"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Edit, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardCardProps {
  id: string;
  name: string;
  lastModified: Date;
}

export function DashboardCard({ id, name, lastModified }: DashboardCardProps) {
  const timeAgo = formatDistanceToNow(new Date(lastModified), { addSuffix: true });
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground">
          Dashboard Preview
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/10 pt-3">
        <span className="text-xs text-muted-foreground">Updated {timeAgo}</span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link href={`/app/dashboards/${id}/edit`}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            asChild
          >
            <Link href={`/app/dashboards/${id}`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
