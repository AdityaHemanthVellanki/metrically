"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl gradient-text">Metrically</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition">Features</Link>
              <Link href="#ai-tech" className="text-muted-foreground hover:text-foreground transition">AI Tech</Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">Dashboard</Link>
              <Link href="/examples" className="text-muted-foreground hover:text-foreground transition">Examples</Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">{user?.full_name || user?.email}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/auth/register')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-8">
                {!isAuthenticated ? (
                  <>
                    <Link href="#features" className="text-lg font-medium">Features</Link>
                    <Link href="#ai-tech" className="text-lg font-medium">AI Tech</Link>
                    <Link href="#pricing" className="text-lg font-medium">Pricing</Link>
                    <div className="flex flex-col gap-3 mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/auth/login')}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full"
                        onClick={() => router.push('/auth/register')}
                      >
                        Get Started
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-1 py-2 border-b">
                      <p className="font-semibold">{user?.full_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="text-lg font-medium">Dashboard</Link>
                    <Link href="/examples" className="text-lg font-medium">Examples</Link>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 flex items-center justify-center gap-2"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
