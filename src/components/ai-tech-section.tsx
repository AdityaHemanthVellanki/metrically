"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function AiTechSection() {
  return (
    <section id="ai-tech" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Tech Stack</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by cutting-edge AI to deliver accurate KPI systems for your specific business needs.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="relative h-12 w-48">
              <Image 
                src="/images/ai/openai-logo.svg"
                alt="OpenAI logo"
                width={192}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-muted-foreground">via</span>
            <div className="relative h-12 w-48">
              <Image 
                src="/images/ai/azure-logo.svg"
                alt="Azure logo"
                width={192}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative p-6 md:p-8 bg-card/50 backdrop-blur-sm border border-muted rounded-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Flow diagram */}
              <div className="w-full md:w-3/5 flex-shrink-0">
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <span className="font-medium text-primary text-lg">1</span>
                    </div>
                    <div className="flex-1 p-4 border border-border rounded-lg bg-background/50">
                      <h4 className="font-medium mb-1">User Input</h4>
                      <p className="text-sm text-muted-foreground">Your product type, stage, and tech stack</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-10 text-muted-foreground rotate-90" />
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <span className="font-medium text-primary text-lg">2</span>
                    </div>
                    <div className="flex-1 p-4 border border-border rounded-lg bg-background/50">
                      <h4 className="font-medium mb-1">GPT Analysis</h4>
                      <p className="text-sm text-muted-foreground">Advanced AI processes your specific needs</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-10 text-muted-foreground rotate-90" />
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <span className="font-medium text-primary text-lg">3</span>
                    </div>
                    <div className="flex-1 p-4 border border-border rounded-lg bg-background/50">
                      <h4 className="font-medium mb-1">KPI System + SQL</h4>
                      <p className="text-sm text-muted-foreground">Customized metrics and ready-to-use code</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-10 text-muted-foreground rotate-90" />
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <span className="font-medium text-primary text-lg">4</span>
                    </div>
                    <div className="flex-1 p-4 border border-border rounded-lg bg-background/50">
                      <h4 className="font-medium mb-1">Output</h4>
                      <p className="text-sm text-muted-foreground">Complete KPI framework with visualizations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="w-full md:w-2/5">
                <h3 className="text-xl font-medium mb-4">Benefits of AI-Driven KPIs:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-primary/10 text-primary mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Industry-specific metrics tailored to your stage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-primary/10 text-primary mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Time saved vs. manual research and setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-primary/10 text-primary mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Constantly updated with latest best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-primary/10 text-primary mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Eliminates decision paralysis and metric bloat</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
