'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, ChevronDown, Menu, Star, Trash, Github, FolderPlus, Cloud, X, FileUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const GITHUB_CLIENT_ID = 'Ov23liT7U9majuZ1XYCf'
const REDIRECT_URI = 'http://localhost:3000/chat-page'

interface Message {
  role: string;
  content: string;
  link: string | null; // Allow link to be a string or null
  deployed?: string; // Optional deployed link
}

const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('')
  const index = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplayText((prev) => prev + text.charAt(index.current))
        index.current += 1
      } else {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [text])

  return (
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
      {displayText}
    </h2>
  )
}

const LoadingAnimation = ({ isFileUploaded }: { isFileUploaded: boolean }) => {
  const [loadingStep, setLoadingStep] = useState(0)
  const loadingMessages = isFileUploaded
    ? ["Analysing your file", "Analysing your content"]
    : [
        "Analysing your prompt",
        "Fetching the relevant langchain model",
        "Restructuring your prompts",
        "Giving your prompts to gemini backend",
        "Fetching your results"
      ]

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStep((prevStep) => (prevStep + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [loadingMessages])

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <div className="text-sm text-gray-600">{loadingMessages[loadingStep]}</div>
    </div>
  )
}

export function ChatPageComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! How can I help you with your coding project today?',
      link: null, // No GitHub link for this initial message
    }
  ]);
  
  const [input, setInput] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [savedChats, setSavedChats] = useState<{ id: number; title: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGitHubAuthorized, setIsGitHubAuthorized] = useState(true)
  const [isAwsConnected, setIsAwsConnected] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAwsDialogOpen, setIsAwsDialogOpen] = useState(false)
  const [awsCredentials, setAwsCredentials] = useState({
    accessKey: '',
    secretKey: '',
    instanceId: '',
    region: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      exchangeCodeForToken(code)
    }
  }, [])

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch('/api/github-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          clientId: GITHUB_CLIENT_ID,
          clientSecret: '6afcd191a91d304a409c80cd155e2be01b57f87a',
          redirectUri: REDIRECT_URI
        }),
      })
      const data = await response.json()
      if (data.access_token) {
        setAccessToken(data.access_token)
        setIsGitHubAuthorized(true)
        window.history.replaceState({}, document.title, "/chat-page")
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error)
    }
  }

 const handleSend = () => {
  if (input.trim() || fileContent) {
    const messageContent = fileContent || input;

    // Create user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: messageContent, link: null }, // Include link as null
    ]);

    // Clear input and file name
    setInput('');
    setFileName(null);
    setIsLoading(true);

    // Generate bot response after a variable delay
    const { botResponse, delay } = generateBotResponse(messageContent);
    
    // Use the dynamic delay for the bot's response
    setTimeout(() => {
      // Create bot message and add it to state
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: botResponse.content, // Use the content from bot response
          link: botResponse.link, // Include the link if present
          deployed: botResponse.deployed, // Include deployed link if present
        },
      ]);
      setIsLoading(false);
    }, delay); // Use the delay returned by the bot response

    // Clear file content
    setFileContent(null);
  }
};

const generateBotResponse = (userInput: string) => {
  const lowercaseInput = userInput.toLowerCase();

  // Initialize a structured response
  let botMessage: {
    role: string;
    content: string;
    link: string | null; // Allow link to be a string or null
    deployed?: string; // Optional deployed link
  } = {
    role: 'assistant',
    content: '',
    link: null,
  };
  // Define default delay (e.g., 1 second)
  let delay = 1000;

  // Custom responses and delay times
  if (lowercaseInput.includes('gym')) {
    botMessage.content = 'Awesome! I see you’re interested in the gym. Here’s your dedicated gym website. Feel free to check it out on GitHub:';
    botMessage.link = 'https://github.com/aryamanpathak2022/Fitzone-Gym-By-Promptflow'; // GitHub link
    botMessage.deployed = 'http://54.158.160.53:3000/'; // Deployed link
    delay = 20000; // 10 seconds delay for gym

} else if (lowercaseInput.includes('cooking')) {
    botMessage.content = "Great choice! Your cooking website is all set. You can review the code and deploy it using the link below:";
    botMessage.link = "https://github.com/aryamanpathak2022/Saapna-s-Kitchen-By-PromptFlow"; // GitHub link
    botMessage.deployed = "http://54.236.114.182:3000/"; // Deployed link
    delay = 20000; // 5 seconds delay for cooking

} else {
    botMessage.content = 'No problem! Please share your Software Requirement Specification Document, and I’ll help you create a GitHub repository and deployment based on that.';

    delay = 1000; // 1 second delay for other responses
}

return { botResponse: botMessage, delay }; // Return both the bot message and the delay

}



  const handleSaveChat = () => {
    const newSavedChat = {
      id: Date.now(),
      title: `Chat ${savedChats.length + 1}`,
    }
    setSavedChats([...savedChats, newSavedChat])
  }

  const handleDeleteChat = (id: number) => {
    setSavedChats(savedChats.filter((chat) => chat.id !== id))
  }

  const handleConnectToGitHub = () => {
    if (isGitHubAuthorized) {
      return
    }
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo`
    window.location.href = githubAuthUrl
  }

  const handleCreateRepo = async () => {
    if (!accessToken) return

    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `token ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'my-new-repo',
          description: 'Repository created from ChatBot',
          private: false,
        }),
      })

      if (response.ok) {
        const repo = await response.json()
        await createFile(repo.full_name, 'README.md', '# My New Repository\n\nThis repository was created using ChatBot.')
        alert('Repository created successfully!')
      } else {
        throw new Error('Failed to create repository')
      }
    } catch (error) {
      console.error('Error creating repository:', error)
      alert('Failed to create repository. Please try again.')
    }
  }

  const createFile = async (repoFullName: string, path: string, content: string) => {
    try {
      await fetch(`https://api.github.com/repos/${repoFullName}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Create README.md',
          content: btoa(content),
        }),
      })
    } catch (error) {
      console.error('Error creating file:', error)
    }
  }

  const handleAwsConnect = () => {
    setIsAwsDialogOpen(true)
  }

  const handleAwsSubmit = () => {
    console.log('AWS Credentials:', awsCredentials)
    setIsAwsConnected(true)
    setIsAwsDialogOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/plain') {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileContent(content)
      }
      reader.readAsText(file)
    } else {
      alert('Please upload a text file.')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'text/plain') {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileContent(content)
      }
      reader.readAsText(file)
    } else {
      alert('Please upload a text file.')
    }
  }

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      <div className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold">Saved Chats</h2>
          <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4">
            <Button className="w-full justify-between bg-blue-600 text-white hover:bg-blue-700 mb-4" onClick={handleSaveChat}>
              New Chat <ChevronDown size={16} />
            </Button>
            {savedChats.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between mb-2">
                <Button variant="ghost" className="w-full justify-start text-left text-gray-700 hover:bg-gray-200">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  {chat.title}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteChat(chat.id)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setIsSidebarOpen(true)} className="mr-4 text-gray-700">
              <Menu size={24} />
            </Button>
            <TypewriterEffect text="Sttart With PromptFlow" />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className={`${isGitHubAuthorized ? 'bg-green-500 text-white' : 'bg-black text-white'} hover:bg-opacity-80`}
              onClick={handleConnectToGitHub}
            >
              <Github className="w-5 h-5 mr-2" />
              {isGitHubAuthorized ? 'Connected to GitHub' : 'Connect to GitHub'}
            </Button>
            <Button variant="outline" onClick={handleCreateRepo} disabled={!isGitHubAuthorized}>
              <FolderPlus className="w-5 h-5 mr-2" />
              Create Repo
            </Button>
            <Button
              variant="outline"
              className={`${isAwsConnected ? 'bg-green-500 text-white' : ''} hover:bg-opacity-80`}
              onClick={handleAwsConnect}
            >
              <Cloud className="w-5 h-5 mr-2" />
              {isAwsConnected ? 'Connected to Cloud' : 'Connect to Cloud'}
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
  <div
    key={index}
    className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
  >
    <div
      className={`inline-block p-3 rounded-lg ${
        message.role === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 border border-gray-200 text-gray-700'
      }`}
    >
      {/* Display message content */}
      {message.content}

      {/* GitHub link (always shown if available) */}
      {message.link && (
        <a
          href={message.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mt-2 text-blue-500 hover:underline"
        >
          <Github className="w-5 h-5 mr-2" />
          View GitHub Project
        </a>
      )}

      {/* Deployed link (conditionally shown if available) */}
      {message.deployed && (
        <a
          href={message.deployed}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mt-2 text-blue-500 hover:underline"
        >
          <Cloud className="w-5 h-5 mr-2" />
          View Deployed Project
        </a>
      )}
    </div>
  </div>
))}


  {isLoading && (
    <div className="mt-4 text-left">
      <LoadingAnimation isFileUploaded={!!fileContent} />
    </div>
  )}
</ScrollArea>




        <footer className="p-4 bg-gray-100 border-t border-gray-200">
          <div 
            className="flex items-center space-x-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Input
              placeholder={fileName ? `File selected: ${fileName}` : "Type your message here..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-white text-gray-900 border-gray-300"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              <FileUp className="w-5 h-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt"
              style={{ display: 'none' }}
            />
            <Button onClick={handleSend} disabled={(!input.trim() && !fileContent) || isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </footer>
      </div>

      <Dialog open={isAwsDialogOpen} onOpenChange={setIsAwsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Google Cloud Platform</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="accessKey">Access Key</Label>
              <Input
                id="accessKey"
                value={awsCredentials.accessKey}
                onChange={(e) => setAwsCredentials({ ...awsCredentials, accessKey: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                value={awsCredentials.secretKey}
                onChange={(e) => setAwsCredentials({...awsCredentials, secretKey: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="instanceId">Instance ID</Label>
              <Input
                id="instanceId"
                value={awsCredentials.instanceId}
                onChange={(e) => setAwsCredentials({...awsCredentials, instanceId: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={awsCredentials.region}
                onChange={(e) => setAwsCredentials({...awsCredentials, region: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAwsSubmit} className="bg-green-600 text-white hover:bg-green-700">
              Connect to AWS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}