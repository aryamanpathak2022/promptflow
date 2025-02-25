import { useState, useEffect } from 'react'

const loadingMessages = [
  "Flexing our AI muscles...",
  "Cooking up some knowledge...",
  "Lifting the weight of your query...",
  "Stirring the pot of information...",
  "Pumping iron... I mean, data...",
  "Preheating our neural ovens...",
]

interface LoadingAnimationProps {
  isLoading: boolean
}

export function LoadingAnimation({ isLoading }: LoadingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-ping"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-300">{loadingMessages[messageIndex]}</p>
    </div>
  )
}

