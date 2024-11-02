import {
  Link,
} from "@remix-run/react";

import { Menu, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'

export function Layout({ children }: { children: React.ReactNode }) {
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
          {children}
          <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col md:flex-row justify-between items-center mx-auto">
              <div className="flex items-center space-x-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-medium">© 2024 LawfulDiffusion. All rights reserved.</span>
              </div>
              <nav className="flex space-x-4 mt-4 md:mt-0">
                <Link to="/about" className="text-sm text-muted-foreground hover:underline underline-offset-4">
                  About
                </Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:underline underline-offset-4">
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