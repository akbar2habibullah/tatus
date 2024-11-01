import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Sparkles, Menu } from "lucide-react"
import { Link } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useState } from 'react'
import { Switch } from '../components/ui/switch'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [username, setUsername] = useState("naturephotographer")
  const [email, setEmail] = useState("alex@example.com")
  const [bio, setBio] = useState("Capturing the beauty of nature through my lens.")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [privacyLevel, setPrivacyLevel] = useState("public")
  const [theme, setTheme] = useState("system")

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile data to your backend
    console.log("Profile saved", { username, email, bio })
  }

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated preferences to your backend
    console.log("Preferences saved", { notificationsEnabled, privacyLevel, theme })
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

      <div className="container mx-auto px-4 py-8 max-w-[800px] grow">
        <h1 className="text-3xl font-bold mb-8">User Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
                        <AvatarFallback>NP</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Avatar</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Save Profile</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details and security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Change Password</Button>
              </CardContent>
              <CardFooter>
                <Button variant="destructive">Delete Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePreferences} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal text-sm text-muted-foreground">Receive email about your account activity</span>
                    </Label>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privacy">Privacy Level</Label>
                    <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
                      <SelectTrigger id="privacy">
                        <SelectValue placeholder="Select privacy level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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