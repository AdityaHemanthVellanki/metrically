"use client";

import Link from "next/link";
import { Building2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StartupProfileStatusProps {
  isComplete: boolean;
  missingFields?: string[];
}

export function StartupProfileStatus({ isComplete, missingFields = [] }: StartupProfileStatusProps) {
  return (
    <Card className={`border-l-4 ${isComplete ? 'border-l-green-500' : 'border-l-amber-500'}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-2 ${isComplete ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {isComplete ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-medium mb-1">
              Startup Profile: {isComplete ? 'Complete ✅' : 'Incomplete ❗'}
            </h3>
            {!isComplete && missingFields.length > 0 && (
              <div className="text-sm text-muted-foreground mb-2">
                <p>The following fields are missing:</p>
                <ul className="list-disc list-inside mt-1">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="text-xs w-full justify-between"
          asChild
        >
          <Link href="/app/profile">
            <span>{isComplete ? 'Edit Profile' : 'Complete Your Profile'}</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
