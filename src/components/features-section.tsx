"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Code2, LayoutDashboard, Sparkles } from "lucide-react"

const features = [
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Smart KPI Generation",
    description: "Get the most important metrics for your startup, no guessing needed."
  },
  {
    icon: <Code2 className="h-10 w-10 text-primary" />,
    title: "Auto-Generated SQL",
    description: "Drop-in-ready queries tailored to your stack—Postgres, Firebase, or Supabase."
  },
  {
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    title: "Dashboard Layouts",
    description: "Ready-to-use visualizations for Metabase, Looker, or your BI of choice."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "GPT-Powered Insights",
    description: "Understand why each KPI matters, with explainers and goal-setting suggestions."
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From KPI generation to interactive dashboards, Metrically gives you everything you need to measure what matters.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border border-muted hover:shadow-md transition-all duration-300 hover:border-primary/20">
              <CardHeader>
                <div className="mb-4 p-2 inline-flex rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
