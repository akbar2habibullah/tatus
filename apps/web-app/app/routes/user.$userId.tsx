import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button"
import { Heart, Download, Plus, Settings, Bookmark, Grid } from "lucide-react"
import { Link } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useState } from 'react'
import { Layout } from './_layout'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const user = {
  username: "naturephotographer",
  name: "Alex Johnson",
  bio: "Capturing the beauty of nature through my lens. Follow for daily doses of wilderness!",
  followers: 15200,
  following: 420,
  postsCount: 287,
  avatarSrc: "/placeholder.svg?height=150&width=150",
}

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

export default function Index() {
  const [likedPhotos, setLikedPhotos] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLikedPhotos(prev => 
      prev.includes(id) ? prev.filter(photoId => photoId !== id) : [...prev, id]
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatarSrc} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <div className="flex gap-2">
                  <Button>Follow</Button>
                  <Button variant="outline">Message</Button>
                </div>
              </div>
              <div className="flex gap-8 mb-4">
                <span><strong>{user.postsCount}</strong> posts</span>
                <span><strong>{user.followers.toLocaleString()}</strong> followers</span>
                <span><strong>{user.following.toLocaleString()}</strong> following</span>
              </div>
              <div>
                <h2 className="font-bold">{user.name}</h2>
                <p>{user.bio}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8 border-t border-b py-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </Button>
          <Link to="/setting">
            <Button variant="ghost" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[10px]">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group overflow-hidden"
              style={{
                gridRowEnd: `span ${Math.ceil(photo.height / photo.width * 15)}`,
              }}
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
                    onClick={() => toggleLike(photo.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedPhotos.includes(photo.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="sr-only">Like photo</span>
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add to collection</span>
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download photo</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}