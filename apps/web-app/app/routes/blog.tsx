import type { MetaFunction } from "@remix-run/node";
import { Layout } from './_layout'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Link } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { Button } from '../components/ui/button'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const blogPosts = [
  {
    id: 1,
    title: "The Art of Landscape Photography",
    excerpt: "Discover the secrets to capturing breathtaking landscape photos that tell a story and evoke emotion.",
    author: {
      name: "Alice Johnson",
      avatar: "/placeholder.svg"
    },
    date: "2024-03-01",
    readingTime: "5 min read",
    thumbnailSrc: "/header.png"
  },
  {
    id: 2,
    title: "Mastering Portrait Lighting",
    excerpt: "Learn the essential lighting techniques to create stunning portrait photographs in any setting.",
    author: {
      name: "Bob Smith",
      avatar: "/placeholder.svg"
    },
    date: "2024-02-28",
    readingTime: "7 min read",
    thumbnailSrc: "/header.png"
  },
  {
    id: 3,
    title: "The Power of Black and White Photography",
    excerpt: "Explore the timeless appeal of monochrome images and how to create impactful black and white photos.",
    author: {
      name: "Carol Davis",
      avatar: "/placeholder.svg"
    },
    date: "2024-02-25",
    readingTime: "6 min read",
    thumbnailSrc: "/header.png"
  },
  {
    id: 4,
    title: "Street Photography: Capturing Urban Life",
    excerpt: "Tips and techniques for documenting the vibrant energy and candid moments of city streets.",
    author: {
      name: "David Lee",
      avatar: "/placeholder.svg"
    },
    date: "2024-02-22",
    readingTime: "8 min read",
    thumbnailSrc: "/header.png"
  },
  {
    id: 5,
    title: "Macro Photography: A Closer Look",
    excerpt: "Dive into the world of macro photography and learn how to capture the intricate details of small subjects.",
    author: {
      name: "Eva Brown",
      avatar: "/placeholder.svg"
    },
    date: "2024-02-19",
    readingTime: "6 min read",
    thumbnailSrc: "/header.png"
  },
  {
    id: 6,
    title: "The Essentials of Photo Composition",
    excerpt: "Master the fundamental principles of composition to create visually compelling and balanced photographs.",
    author: {
      name: "Frank Wilson",
      avatar: "/placeholder.svg"
    },
    date: "2024-02-16",
    readingTime: "7 min read",
    thumbnailSrc: "/header.png"
  }
]

export default function Index() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 grow">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative w-full">
                  <img
                    src={post.thumbnailSrc}
                    alt={`Thumbnail for ${post.title}`}
                    className="rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <CardTitle className="text-xl mb-2">
                  <Link to={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{post.author.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                      <span className="mx-1">·</span>
                      <ClockIcon className="mr-1 h-3 w-3" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}