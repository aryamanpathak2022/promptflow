'use client'

import * as React from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlignCenter, AlignLeft, AlignRight, Bold, ChevronDown, Code, Columns, Copy, Crop, FileText, MessageSquare, Italic, LayoutDashboard, Layers, Moon, Redo, Save, Settings, Sun, Trash2, Underline, Undo, Stars, Sparkles, Upload } from 'lucide-react'

const initialComponents = [
  { id: "text", content: "Text Block", icon: LayoutDashboard },
  { id: "image", content: "Image", icon: FileText },
  { id: "video", content: "Video", icon: Layers },
  { id: "button", content: "Button", icon: Copy },
  { id: "form", content: "Form", icon: Code },
  { id: "carousel", content: "Carousel", icon: Columns },
  { id: "header", content: "Header", icon: Crop },
  { id: "footer", content: "Footer", icon: Crop },
  { id: "ai-generated", content: "Generate with AI", icon: Stars },
]

const templates = [
  { id: "blank", name: "Blank" },
  { id: "landing", name: "Landing Page" },
  { id: "blog", name: "Blog" },
  { id: "ecommerce", name: "E-commerce" },
]

const initialCanvasItems = [
  { id: "header-1", type: "header", content: "Welcome to Our Amazing Platform", icon: Crop },
  { id: "image-1", type: "image", content: "Hero Image", icon: FileText, src: "https://images.unsplash.com/photo-1492112007959-c35ae067c37b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", alt: "Hero image of a beautiful landscape" },
  { id: "text-1", type: "text", content: "Discover the power of our innovative solutions designed to transform your digital experience. Our cutting-edge platform combines ease of use with powerful features to help you achieve your goals faster and more efficiently than ever before.", icon: LayoutDashboard },
  { id: "button-1", type: "button", content: "Get Started", icon: Copy, url: "#" },
  { id: "button-2", type: "button", content: "Learn More", icon: Copy, url: "#" },
  { id: "text-2", type: "text", content: "Our Features", icon: LayoutDashboard },
  { id: "text-3", type: "text", content: "1. Intuitive Design", icon: LayoutDashboard },
  { id: "text-4", type: "text", content: "2. Powerful Analytics", icon: LayoutDashboard },
  { id: "text-5", type: "text", content: "3. Seamless Integration", icon: LayoutDashboard },
  { id: "footer-1", type: "footer", content: "© 2024 Our Amazing Platform. All rights reserved.", icon: Crop },
]

export function WebsiteBuilderWithoutSRS() {
  const [components, setComponents] = React.useState(initialComponents)
  const [canvasItems, setCanvasItems] = React.useState(initialCanvasItems)
  const [isDarkMode, setIsDarkMode] = React.useState(true)
  const [selectedItem, setSelectedItem] = React.useState(null)
  const [aiPrompt, setAiPrompt] = React.useState("")

  React.useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const onDragEnd = (result) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (source.droppableId === "components" && destination.droppableId === "canvas") {
      const draggedComponent = components[source.index]
      const newCanvasItem = {
        id: `${draggedComponent.id}-${Date.now()}`,
        type: draggedComponent.id,
        content: draggedComponent.content,
        icon: draggedComponent.icon,
      }
      setCanvasItems(prev => {
        const newItems = Array.from(prev)
        newItems.splice(destination.index, 0, newCanvasItem)
        return newItems
      })
    } else if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      setCanvasItems(prev => {
        const newItems = Array.from(prev)
        const [reorderedItem] = newItems.splice(source.index, 1)
        newItems.splice(destination.index, 0, reorderedItem)
        return newItems
      })
    } else if (source.droppableId === "canvas" && destination.droppableId === "dustbin") {
      setCanvasItems(prev => {
        const newItems = Array.from(prev)
        newItems.splice(source.index, 1)
        return newItems
      })
    }
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handlePropertyChange = (property, value) => {
    if (selectedItem) {
      setCanvasItems(prev => prev.map(item => 
        item.id === selectedItem.id ? { ...item, [property]: value } : item
      ))
      setSelectedItem(prev => ({ ...prev, [property]: value }))
    }
  }

  const handleAIGenerate = () => {
    const newItem = {
      id: `ai-generated-${Date.now()}`,
      type: "text",
      content: `AI-generated content based on: "${aiPrompt}"`,
      icon: Stars,
    }
    setCanvasItems(prev => [...prev, newItem])
    setAiPrompt("")
  }

  const renderProperties = () => {
    if (!selectedItem) return <p className="text-sm text-muted-foreground">Select an item to edit its properties.</p>

    switch (selectedItem.type) {
      case 'text':
      case 'header':
      case 'footer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Text</Label>
              <Input 
                id="content" 
                value={selectedItem.content} 
                onChange={(e) => handlePropertyChange('content', e.target.value)}
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <div className="flex gap-2 mt-2">
                <Button size="icon" variant="outline" onClick={() => handlePropertyChange('alignment', 'left')}>
                  <AlignLeft className="h-4 w-4" />
                  <span className="sr-only">Align left</span>
                </Button>
                <Button size="icon" variant="outline" onClick={() => handlePropertyChange('alignment', 'center')}>
                  <AlignCenter className="h-4 w-4" />
                  <span className="sr-only">Align center</span>
                </Button>
                <Button size="icon" variant="outline" onClick={() => handlePropertyChange('alignment', 'right')}>
                  <AlignRight className="h-4 w-4" />
                  <span className="sr-only">Align right</span>
                </Button>
              </div>
            </div>
          </div>
        )
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image Source</Label>
              <Input 
                id="src" 
                value={selectedItem.src || ''} 
                onChange={(e) => handlePropertyChange('src', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input 
                id="alt" 
                value={selectedItem.alt || ''} 
                onChange={(e) => handlePropertyChange('alt', e.target.value)}
              />
            </div>
          </div>
        )
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Button Text</Label>
              <Input 
                id="content" 
                value={selectedItem.content} 
                onChange={(e) => handlePropertyChange('content', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="url">Button URL</Label>
              <Input 
                id="url" 
                value={selectedItem.url || ''} 
                onChange={(e) => handlePropertyChange('url', e.target.value)}
              />
            </div>
          </div>
        )
      default:
        return <p className="text-sm text-muted-foreground">No properties available for this component.</p>
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`flex h-screen flex-col bg-background text-foreground transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <header className="flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button variant="ghost">File</Button>
            <Button variant="ghost">Edit</Button>
            <Button size="icon" variant="ghost">
              <Undo className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button size="icon" variant="ghost">
              <Redo className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline">Preview</Button>
            <Button size="sm">Publish</Button>
            <Button size="icon" variant="ghost">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Label htmlFor="dark-mode" className="sr-only">
                Dark mode
              </Label>
              {isDarkMode ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </div>
          </div>
        </header>
        <main className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold">Components</h2>
              </div>
              <ScrollArea className="flex-1">
                <Droppable droppableId="components" isDropDisabled={true}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-2 p-4">
                      {components.map((component, index) => (
                        <Draggable key={component.id} draggableId={component.id} index={index}>
                          {(provided) => (
                            <Button
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="justify-start"
                              variant="ghost"
                            >
                              <component.icon className="mr-2 h-4 w-4" />
                              {component.content}
                            </Button>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </ScrollArea>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 rounded bg-primary" />
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Droppable droppableId="canvas">
              {(provided) => (
                <ScrollArea
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 p-6"
                >
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {canvasItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-card p-4 rounded-lg shadow-sm border ${selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => handleItemClick(item)}
                          >
                            {item.type === 'header' && (
                              <h1 className="text-4xl font-bold mb-4">{item.content}</h1>
                            )}
                            {item.type === 'text' && (
                              <p className="text-lg mb-4">{item.content}</p>
                            )}
                            {item.type === 'image' && item.src && (
                              <img src={item.src} alt={item.alt || 'Preview'} className="w-full h-auto rounded-lg mb-4" />
                            )}
                            {item.type === 'button' && (
                              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                {item.content}
                              </Button>
                            )}
                            {item.type === 'footer' && (
                              <footer className="text-sm text-muted-foreground mt-8">{item.content}</footer>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </ScrollArea>
              )}
            </Droppable>
            <div className="border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2">
                <Input 
                  className="flex-1" 
                  placeholder="Enter AI prompt here..." 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button onClick={handleAIGenerate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </div>
          </div>
          <div className="w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Tabs defaultValue="properties">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="properties"
                  className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 font-semibold hover:bg-transparent data-[state=active]:border-primary"
                >
                  Properties
                </TabsTrigger>
                <TabsTrigger
                  value="ai-suggestions"
                  className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 font-semibold hover:bg-transparent data-[state=active]:border-primary"
                >
                  AI Suggestions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="properties" className="p-4">
                {renderProperties()}
              </TabsContent>
              <TabsContent value="ai-suggestions" className="p-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">AI suggestions will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <footer className="relative flex items-center justify-between border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button className="text-sm" variant="ghost">Help</Button>
            <Button className="text-sm" variant="ghost">Support</Button>
          </div>
          <Droppable droppableId="dustbin">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                  snapshot.isDraggingOver ? "bg-destructive/20" : ""
                }`}
              >
                <Trash2 className="h-6 w-6 text-muted-foreground" />
                <span className="sr-only">Delete component</span>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="absolute bottom-16 right-6 flex flex-col gap-4">
            {/* <Link href="/plan5">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-full px-6">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with PromptFlow
            </Button>
            </Link> */}
            {/* <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-full px-6">
              <Upload className="mr-2 h-4 w-4" />
              Upload SRS
            </Button> */}
          </div>
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Button>
            <Button size="icon" variant="ghost">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="sr-only">GitHub</span>
            </Button>
          </div>
        </footer>
      </div>
    </DragDropContext>
  )
}