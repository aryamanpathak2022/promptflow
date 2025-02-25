'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import Link from 'next/link'
// Star background component
const StarryBackground = () => {
  const [stars, setStars] = useState(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
    }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prevStars =>
        prevStars.map(star => ({
          ...star,
          top: `${(parseFloat(star.top) + 0.01) % 100}%`,
        }))
      )
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-all duration-[100ms]"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}
    </div>
  )
}

export function StarryQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [typingIndex, setTypingIndex] = useState(-1)
  const [currentText, setCurrentText] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])

  const questions = [
    "WEBSITE NAME HERE ?",
    "CHOOSE YOUR WEBSITE THEME ?",
    "WHAT'S YOUR MAIN GOAL ?",
    "SELECT KEY WORDS THAT DESCRIBE YOU'R IDEA ?",
    "UPLOAD YOUR LOGO HERE ?",
    "CHOOSE YOUR WEBSITE COMPONENTS ?",
    "READY TO TRANSFORM YOUR IDEAS ?"
  ]

  useEffect(() => {
    setTypingIndex(-1)
    const text = questions[currentStep]
    setCurrentText(text)
    const interval = setInterval(() => {
      setTypingIndex(prev => {
        if (prev < text.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 30)
    return () => clearInterval(interval)
  }, [currentStep])

  const renderQuestion = (question: string) => {
    const words = question.split(' ')
    return (
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex">
            {word.split('').map((char, charIndex) => (
              <div
                key={`${wordIndex}-${charIndex}`}
                className={`
                  w-8 h-8 border border-gray-800 flex items-center justify-center
                  ${typingIndex >= question.split(' ').slice(0, wordIndex).join(' ').length + charIndex ? 'opacity-100' : 'opacity-0'}
                  ${char === '?' ? 'text-blue-500' : 'text-white'}
                  transition-opacity duration-200
                `}
              >
                <span className="text-lg font-bold">
                  {char}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <StarryBackground />
      <div className="w-full max-w-4xl px-4 py-16 relative z-10">
        {renderQuestion(questions[currentStep])}

        <div className="space-y-8 bg-gray-900 bg-opacity-50 p-8 rounded-lg backdrop-blur-md">
          {currentStep === 0 && (
            <div className="space-y-4">
              <Label htmlFor="website-name" className="text-lg">Enter your website name:</Label>
              <Input
                id="website-name"
                placeholder="My Awesome Website"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          )}

          {currentStep === 1 && (
            <RadioGroup 
              className="grid grid-cols-2 md:grid-cols-3 gap-4" 
              value={selectedTheme} 
              onValueChange={setSelectedTheme}
            >
              {[
                { name: 'Modern Dark', color: 'bg-gray-800' },
                { name: 'Minimal Light', color: 'bg-gray-200' },
                { name: 'Ocean Theme', color: 'bg-blue-700' },
                { name: 'Forest Theme', color: 'bg-green-700' },
                { name: 'Sunset Theme', color: 'bg-orange-500' }
              ].map((theme) => (
                <div key={theme.name} className="relative">
                  <RadioGroupItem value={theme.name} id={theme.name} className="peer sr-only" />
                  <Label
                    htmlFor={theme.name}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-700 cursor-pointer transition-all duration-200 ${theme.color} hover:scale-105 peer-checked:ring-2 peer-checked:ring-blue-500 ${selectedTheme === theme.name ? 'ring-2 ring-blue-500 scale-105' : ''}`}
                  >
                    <span className={`text-sm font-semibold ${theme.color === 'bg-gray-200' ? 'text-black' : 'text-white'}`}>
                      {theme.name}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStep === 2 && (
            <RadioGroup 
              className="space-y-3" 
              value={selectedGoal} 
              onValueChange={setSelectedGoal}
            >
              {['Increase Sales', 'Brand Awareness', 'Generate Leads', 'Provide Info', 'Show Portfolio'].map((goal, index) => (
                <div key={goal} className="relative">
                  <RadioGroupItem value={goal} id={goal} className="peer sr-only" />
                  <Label
                    htmlFor={goal}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-800 peer-checked:bg-blue-900 peer-checked:border-blue-500 ${selectedGoal === goal ? 'bg-blue-900 border-blue-500' : ''}`}
                  >
                    <span className="text-2xl">{['💰', '🌟', '🎯', 'ℹ️', '🖼️'][index]}</span>
                    <span className="text-lg">{goal}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Innovative', 'Professional', 'Creative', 'Reliable', 'Sustainable', 'Luxurious', 'Modern', 'Traditional'].map((keyword) => (
                <div key={keyword} className="relative">
                  <Checkbox 
                    id={keyword} 
                    className="peer sr-only" 
                    checked={selectedKeywords.includes(keyword)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedKeywords(prev => [...prev, keyword])
                      } else {
                        setSelectedKeywords(prev => prev.filter(k => k !== keyword))
                      }
                    }}
                  />
                  <Label
                    htmlFor={keyword}
                    className={`flex items-center justify-center p-3 rounded-full border-2 border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-800 peer-checked:bg-blue-500 peer-checked:border-blue-300 ${selectedKeywords.includes(keyword) ? 'bg-blue-500 border-blue-300' : ''}`}
                  >
                    {keyword}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center transition-all duration-200 hover:border-blue-500">
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <Label htmlFor="logo-upload" className="cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                Choose Logo File
              </Label>
              <Input id="logo-upload" type="file" className="hidden" accept="image/*" />
              <p className="mt-4 text-sm text-gray-400">
                Drag and drop your logo here, or click to select a file
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Hero', 'About', 'Services', 'Portfolio', 'Testimonials', 'Blog', 'Contact', 'Newsletter'].map((component) => (
                <div key={component} className="relative">
                  <Checkbox 
                    id={component} 
                    className="peer sr-only"
                    checked={selectedComponents.includes(component)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedComponents(prev => [...prev, component])
                      } else {
                        setSelectedComponents(prev => prev.filter(c => c !== component))
                      }
                    }}
                  />
                  <Label
                    htmlFor={component}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-800 peer-checked:bg-blue-900 peer-checked:border-blue-500 ${selectedComponents.includes(component) ? 'bg-blue-900 border-blue-500' : ''}`}
                  >
                    <span className="text-2xl mb-2">{['🦸', 'ℹ️', '🛠️', '🖼️', '💬', '📝', '📞', '📧'][['Hero', 'About', 'Services', 'Portfolio', 'Testimonials', 'Blog', 'Contact', 'Newsletter'].indexOf(component)]}</span>
                    <span className="text-sm">{component}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentStep === 6 && (
            <Link href='/plan3'>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 rounded-lg text-xl font-bold transition-all duration-300 transform hover:scale-105">
              Let's Transform Your Ideas!
            </Button>
            </Link>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="text-white bg-gray-800 hover:bg-gray-700 px-6 py-3 border border-gray-700 rounded-md transition-colors duration-200"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentStep === questions.length - 1}
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3"
          >
            Next <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}