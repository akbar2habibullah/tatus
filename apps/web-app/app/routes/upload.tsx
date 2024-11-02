import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { useState } from 'react'
import { Layout } from './_layout'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'generate' | 'modify'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the file to your backend
    console.log("Uploading file:", file)
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    // Here you would typically send the prompt to your AI service
    console.log("Generating image from prompt:", prompt)
    // Simulating AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPreviewUrl('/placeholder.svg?height=400&width=400&text=AI+Generated')
    setGenerating(false)
  }

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    // Here you would typically send the file and prompt to your AI service
    console.log("Modifying image with prompt:", prompt)
    // Simulating AI modification
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPreviewUrl('/placeholder.svg?height=400&width=400&text=AI+Modified')
    setGenerating(false)
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-lg grow">
        <h1 className="text-3xl font-bold mb-8">Upload or Create a Photo</h1>

        <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'upload' | 'generate' | 'modify')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
            <TabsTrigger value="generate">Generate with AI</TabsTrigger>
            <TabsTrigger value="modify">Modify with AI</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload a Photo</CardTitle>
                <CardDescription>Choose a photo from your device to upload.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload}>
                  <div className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picture">Picture</Label>
                      <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {previewUrl && (
                      <div className="mt-4">
                        <img src={previewUrl} alt="Preview" width={400} height={400} className="rounded-lg object-cover" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="caption">Caption</Label>
                      <Textarea id="caption" placeholder="Add a caption to your photo..." />
                    </div>
                    <Button type="submit" disabled={!file}>Upload Photo</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate an Image with AI</CardTitle>
                <CardDescription>Describe the image you want to create.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Image Description</Label>
                      <Textarea 
                        id="prompt" 
                        placeholder="Describe the image you want to generate..." 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>
                    {previewUrl && (
                      <div className="mt-4">
                        <img src={previewUrl} alt="Generated Preview" width={400} height={400} className="rounded-lg object-cover" />
                      </div>
                    )}
                    <Button type="submit" disabled={!prompt || generating}>
                      {generating ? 'Generating...' : 'Generate Image'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modify">
            <Card>
              <CardHeader>
                <CardTitle>Modify an Image with AI</CardTitle>
                <CardDescription>Upload a photo and describe how you want to modify it.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleModify}>
                  <div className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picture-modify">Picture to Modify</Label>
                      <Input id="picture-modify" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {previewUrl && (
                      <div className="mt-4">
                        <img src={previewUrl} alt="Preview" width={400} height={400} className="rounded-lg object-cover" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="modify-prompt">Modification Description</Label>
                      <Textarea 
                        id="modify-prompt" 
                        placeholder="Describe how you want to modify the image..." 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={!file || !prompt || generating}>
                      {generating ? 'Modifying...' : 'Modify Image'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}