import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button"
import { Button as ButtonEnhanced } from '../components/ui/button-enhanced';
import { Input } from "../components/ui/input"
import { Search, Sparkles, Heart, Menu } from "lucide-react"
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
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
            <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
              License
            </Link>
            <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
              Upload
            </Link>
            <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
              Join
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[600px] flex items-center justify-center p-4">
          <img
            src="/header-3.png"
            alt="Beautiful landscape"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center space-y-6 px-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
              Bridging Generative AI and Artistic Integrity
            </h1>
            <p className="max-w-[600px] text-lg text-gray-200 mx-auto">
              Lawful Diffusion emphasizing its commitment to lawful and ethical standards in AI-driven creativity
            </p>
            <div className="max-w-2xl mx-auto flex">
              <Input
                type="search"
                placeholder="Search high-resolution images"
                className="rounded-r-none placeholder:text-white"
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 w-full">
          <div className="container flex flex-col items-center mx-auto p-4">
            <h2 className="text-3xl font-bold mb-8">Featured Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={`/header.png`}
                    alt={`Featured ${i + 1}`}
                    width={600}
                    height={400}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Button variant="secondary" size="icon">
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Like photo</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-12 md:py-24">
          <div className="container text-center flex flex-col items-center mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Share your vision with the world</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of photographers and showcase your best work to millions of users worldwide.
            </p>
            <ButtonEnhanced variant="gooeyLeft" size="lg" className='bg-black text-white'>
              <Sparkles className="h-4 w-4 mr-2" />
              Start uploading
            </ButtonEnhanced>
          </div>
        </section>
      </main>

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