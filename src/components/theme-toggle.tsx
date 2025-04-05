"use client"

import * as React from "react"
import { Moon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Static dark mode indicator (non-functional toggle)
  return (
    <Button variant="outline" size="icon" className="rounded-full pointer-events-none opacity-70">
      <Moon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Dark mode</span>
    </Button>
  )
}
