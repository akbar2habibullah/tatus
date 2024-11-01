import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button"
import { Sparkles, Heart, Plus, Download, Menu, X } from "lucide-react"
import { Link } from "@remix-run/react";
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Dialog, DialogContent, DialogClose } from "../components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const categories = [
  { id: 'all', name: 'All' },
  { id: 'landscape', name: 'Landscape' },
  { id: 'portrait', name: 'Portrait' },
  { id: 'street', name: 'Street' },
  { id: 'nature', name: 'Nature' },
  { id: 'architecture', name: 'Architecture' },
]

const photos = [
  { id: 1, src: "/explore.jpg", width: 564, height: 1002, alt: "Mountain landscape", photographer: "Alex Johnson", category: "landscape" },
  { id: 2, src: "/explore-2.jpg", width: 563, height: 694, alt: "Serene lake", photographer: "Sam Smith", category: "landscape" },
  { id: 3, src: "/explore-3.jpg", width: 563, height: 984, alt: "Forest path", photographer: "Emily Brown", category: "nature" },
  { id: 4, src: "/explore-4.jpg", width: 564, height: 564, alt: "Waterfall", photographer: "Chris Lee", category: "nature" },
  { id: 5, src: "/explore-5.jpg", width: 736, height: 1308, alt: "Sunset over hills", photographer: "Alex Johnson", category: "landscape" },
  { id: 6, src: "/explore-6.jpg", width: 564, height: 1002, alt: "Misty mountains", photographer: "Sam Smith", category: "landscape" },
  { id: 7, src: "/explore-7.jpg", width: 564, height: 693, alt: "City skyline", photographer: "Taylor Wong", category: "architecture" },
  { id: 8, src: "/explore-8.jpg", width: 564, height: 942, alt: "Street scene", photographer: "Chris Lee", category: "street" },
  { id: 9, src: "/explore-9.jpg", width: 379, height: 376, alt: "Portrait of a stranger", photographer: "Emily Brown", category: "portrait" },
  { id: 10, src: "/explore-10.jpg", width: 563, height: 608, alt: "Mountain landscape", photographer: "Alex Johnson", category: "landscape" },
  { id: 11, src: "/explore.jpg", width: 564, height: 1002, alt: "Serene lake", photographer: "Sam Smith", category: "landscape" },
  { id: 12, src: "/explore-2.jpg", width: 563, height: 694, alt: "Forest path", photographer: "Emily Brown", category: "nature" },
  { id: 13, src: "/explore-3.jpg", width: 563, height: 984, alt: "Waterfall", photographer: "Chris Lee", category: "nature" },
  { id: 14, src: "/explore-4.jpg", width: 564, height: 564, alt: "Sunset over hills", photographer: "Alex Johnson", category: "landscape" },
  { id: 15, src: "/explore-5.jpg", width: 736, height: 1308, alt: "Misty mountains", photographer: "Sam Smith", category: "landscape" },
  { id: 16, src: "/explore-6.jpg", width: 564, height: 1002, alt: "City skyline", photographer: "Taylor Wong", category: "architecture" },
  { id: 17, src: "/explore-7.jpg", width: 564, height: 693, alt: "Street scene", photographer: "Chris Lee", category: "street" },
  { id: 18, src: "/explore-8.jpg", width: 564, height: 942, alt: "Portrait of a stranger", photographer: "Emily Brown", category: "portrait" },
  { id: 19, src: "/explore-9.jpg", width: 379, height: 376, alt: "Mountain landscape", photographer: "Alex Johnson", category: "landscape" },
  { id: 20, src: "/explore-10.jpg", width: 563, height: 608, alt: "Serene lake", photographer: "Sam Smith", category: "landscape" },
]

const topContributors = [
  { id: 1, name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", photoCount: 156, likes: 3420 },
  { id: 2, name: "Sam Smith", avatar: "/placeholder.svg?height=40&width=40", photoCount: 132, likes: 2980 },
  { id: 3, name: "Emily Brown", avatar: "/placeholder.svg?height=40&width=40", photoCount: 98, likes: 2145 },
  { id: 4, name: "Chris Lee", avatar: "/placeholder.svg?height=40&width=40", photoCount: 87, likes: 1876 },
  { id: 5, name: "Taylor Wong", avatar: "/placeholder.svg?height=40&width=40", photoCount: 76, likes: 1654 },
]

export default function Index() {
  const [likedPhotos, setLikedPhotos] = useState<number[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const toggleLike = (id: number) => {
    setLikedPhotos(prev => 
      prev.includes(id) ? prev.filter(photoId => photoId !== id) : [...prev, id]
    )
  }

  const filteredPhotos = activeCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory)

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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Photography</h1>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="flex justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          <div className="md:basis-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[10px]">
              {filteredPhotos.map((photo) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={photo.id}
                  className="relative group overflow-hidden cursor-pointer"
                  style={{
                    gridRowEnd: `span ${Math.ceil(photo.height / photo.width * 15)}`,
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(photo.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${likedPhotos.includes(photo.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="sr-only">Like photo</span>
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="icon" className="rounded-full" onClick={(e) => e.stopPropagation()}>
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Add to collection</span>
                        </Button>
                        <Button variant="secondary" size="icon" className="rounded-full" onClick={(e) => e.stopPropagation()}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download photo</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded">
                    {photo.photographer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='basis-1/4'>
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <li key={contributor.id} className="flex items-center space-x-4">
                      <span className="text-muted-foreground">{index + 1}</span>
                      <Avatar>
                        <AvatarImage src={contributor.avatar} alt={contributor.name} />
                        <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link to={`/user/${contributor.id}`} className="font-medium hover:underline">
                          {contributor.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {contributor.photoCount} photos · {contributor.likes} likes
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 mx-auto w-full md:w-fit rounded-lg">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              {selectedPhoto && (
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  className="object-contain w-full h-full rounded-lg"
                />
              )}
              <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
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