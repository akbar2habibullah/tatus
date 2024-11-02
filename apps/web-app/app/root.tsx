import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { Camera, Home, Search, Upload } from 'lucide-react'
import { Button } from './components/ui/button'

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex flex-col min-h-screen text-black">
      <div className="flex flex-col items-center justify-center bg-background text-foreground p-4 grow">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-32 h-32 text-primary opacity-20" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold">Oops! Page Not Found</h1>
          
          <p className="text-xl text-muted-foreground">
            It seems the photo you&apos;re looking for has vanished into thin air. Let&apos;s get you back on track!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore">
                <Search className="mr-2 h-4 w-4" />
                Explore Photos
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload a Photo
              </Link>
            </Button>
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© 2024 PhotoShare. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return <Outlet />;
}