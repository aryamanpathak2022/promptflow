'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, Send, Clock, Github, Cloud } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export default function ChatInterfacePlain() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [heroMessages] = useState<string[]>([
    "What can PromptFlow do for you today?",
    "Start your day with PromptFlow",
    "PromptFlow is always there for you"
  ])
  const [currentHeroMessage, setCurrentHeroMessage] = useState('')
  const [showHeroMessage, setShowHeroMessage] = useState(true)
  const [isGithubConnected, setIsGithubConnected] = useState(false)
  const [isAwsConnected, setIsAwsConnected] = useState(false)
  const [githubUsername, setGithubUsername] = useState('')
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const previousChats = [
    { id: 1, title: "Project Kickoff Discussion", date: "2024-03-15" },
    { id: 2, title: "UI/UX Design Review", date: "2024-03-17" },
    { id: 3, title: "Backend Architecture Planning", date: "2024-03-20" },
    { id: 4, title: "Sprint Planning Meeting", date: "2024-03-22" },
    { id: 5, title: "Code Review Session", date: "2024-03-25" },
    { id: 6, title: "Client Presentation Prep", date: "2024-03-27" },
  ]

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setShowHeroMessage(false)
      setMessages(prev => [...prev, { role: 'user', content: inputMessage }])
      setInputMessage('')
      setIsLoading(true)

      // Simulate AI response (replace with actual API call in production)
      await new Promise(resolve => setTimeout(resolve, 3000))
      setIsLoading(false)
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm here to help. What would you like assistance with today?" }])
    }
  }

  const handleGithubConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    if (!clientId) {
      showNotification('GitHub Client ID is not configured', 'error')
      return
    }
    const redirectUri = `${window.location.origin}/api/github-callback`
    const scope = 'read:user'
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
  }

  const handleAwsConnect = async () => {
    // Simulate AWS connection process
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsAwsConnected(true)
    showNotification('Connected to AWS successfully', 'success')
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    let currentIndex = 0
    let currentMessageIndex = 0
    let timeoutId: NodeJS.Timeout

    const typeHeroMessage = () => {
      if (currentMessageIndex < heroMessages.length) {
        if (currentIndex === 0) {
          setCurrentHeroMessage('')
        }

        if (currentIndex < heroMessages[currentMessageIndex].length) {
          setCurrentHeroMessage((prev) => prev + heroMessages[currentMessageIndex][currentIndex])
          currentIndex++
          timeoutId = setTimeout(typeHeroMessage, 100)
        } else {
          timeoutId = setTimeout(() => {
            currentIndex = 0
            currentMessageIndex++
            typeHeroMessage()
          }, 2000)
        }
      } else {
        currentMessageIndex = 0
        typeHeroMessage()
      }
    }

    typeHeroMessage()

    return () => clearTimeout(timeoutId)
  }, [heroMessages])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const stars: { x: number; y: number; radius: number; color: string; speedX: number; speedY: number }[] = []
    const numStars = 100
    const colors = ['#ffffff']

    for (let i = 0; i < numStars; i++) {
      const r = Math.random() * 1.5 + 0.5
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: r,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1
      })
    }

    const drawStars = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()

        star.x += star.speedX
        star.y += star.speedY

        if (star.x < 0 || star.x > canvas.width) star.speedX *= -1
        if (star.y < 0 || star.y > canvas.height) star.speedY *= -1
      })
    }

    const animateStars = () => {
      drawStars()
      requestAnimationFrame(animateStars)
    }

    animateStars()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      // Exchange code for access token
      fetch('/api/github-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          setIsGithubConnected(true)
          setGithubUsername(data.username)
          showNotification('Connected to GitHub successfully', 'success')
        } else {
          showNotification('Failed to connect to GitHub', 'error')
        }
      })
      .catch(() => {
        showNotification('Error connecting to GitHub', 'error')
      })

      // Remove the code from the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-gray-300 flex flex-col relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href='/'>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bar0hfVz9p0aZ3pAuBXRnWB4McVmEd.png"
              alt="PromptFlow Logo"
              width={120}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Button
            onClick={handleGithubConnect}
            className={`bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center ${
              isGithubConnected ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            <Github className="w-4 h-4 mr-2" />
            {isGithubConnected ? `Connected: ${githubUsername}` : 'Connect to GitHub'}
          </Button>
          <Button
            onClick={handleAwsConnect}
            className={`bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center ${
              isAwsConnected ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            <Cloud className="w-4 h-4 mr-2" />
            {isAwsConnected ? 'Connected to AWS' : 'Connect to AWS'}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Clock className="w-5 h-5 mr-2" />
                Previous Chats
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black bg-opacity-90 backdrop-blur-md text-gray-100">
              <h2 className="text-lg font-semibold mb-4">Previous Chats</h2>
              <ul className="space-y-2">
                {previousChats.map((chat) => (
                  <li key={chat.id} className="p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors duration-200">
                    <h3 className="font-medium">{chat.title}</h3>
                    <p className="text-sm text-gray-400">{chat.date}</p>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" className="text-gray-300 hover:text-white"><Menu /></Button>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col p-4">
        <div className="flex-grow flex flex-col space-y-4">
          <ScrollArea className="flex-grow bg-black bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-800">
            {showHeroMessage && (
              <div className="text-center text-2xl font-bold text-purple-400 mb-8">
                {currentHeroMessage}
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center space-x-2 my-4">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-gray-800 text-white border-gray-700"
            />
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black bg-opacity-80 backdrop-blur-sm border-t border-gray-800 p-4 text-center">
        <p className="text-gray-500">&copy; 2024 Prompt Flow. All rights reserved.</p>
        <div className="mt-2">
          <a href="#" className="text-purple-400 hover:text-purple-300 mx-2">About</a>
          <a href="#" className="text-purple-400 hover:text-purple-300 mx-2">Contact</a>
          <a href="#" className="text-purple-400 hover:text-purple-300 mx-2">Privacy Policy</a>
        </div>
      </footer>

      <style jsx global>{`
        .loading-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 24px;
        }

        .loading-dots div {
          width: 8px;
          height: 8px;
          margin: 0 4px;
          background-color: #8B5CF6;
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }

        .loading-dots div:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots div:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          to {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}