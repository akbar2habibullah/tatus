import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Sparkles, Menu, Loader, Facebook, Mail } from "lucide-react"
import { Link } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Here you would typically send a request to your authentication API
    console.log('Login attempt', { email, password })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }
  
  return (
    <div className="flex flex-col min-h-screen text-black">
      <header className="sticky top-0 z-50 w-full bg-white/30 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">LawfulDiffusion</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/explore" className="text-sm font-medium hover:underline underline-offset-4">
              Explore
            </Link>
            <Link to="/upload" className="text-sm font-medium hover:underline underline-offset-4">
              Upload
            </Link>
            <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Join
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto flex items-center justify-center px-4 grow">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login to PhotoShare</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary underline-offset-4 transition-colors hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center mx-auto">
          <div className="flex items-center space-x-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium">© 2024 LawfulDiffusion. All rights reserved.</span>
          </div>
          <nav className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              About
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Blog
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Community
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Help
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}