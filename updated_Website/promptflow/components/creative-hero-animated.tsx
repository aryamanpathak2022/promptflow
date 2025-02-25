'use client'
import { useEffect, useState, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { StarryQuestionnaire } from './starry-questionnaire'
const phrases = [
  { prefix: "What if you could", line1: "TRANSFORM", line2: "YOUR IDEAS", line3: "INSTANTLY", suffix: "?" },
  { prefix: "Imagine having", line1: "POWERFUL", line2: "AI TOOLS", line3: "AT HAND", suffix: "→" },
  { prefix: "Ready to", line1: "AUTOMATE", line2: "YOUR WORK", line3: "TODAY", suffix: "!" }
]

const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
        speedY: r * 0.05
      })
    }

    const drawStars = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()

        star.x += star.speedX
        star.y += star.speedY

        if (star.x < 0 || star.x > canvas.width) star.speedX *= -1
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" aria-hidden="true" />
}

const GridText = ({ text, delay = 0, showArrow = false, showQuestion = false }) => {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev < text.length) {
            return prev + 1
          }
          clearInterval(interval)
          return prev
        })
      }, 100)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <div className="flex items-center gap-1">
      {showArrow && (
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-cyan-500 animate-pulse" />
        </div>
      )}
      {text.split('').map((char, i) => (
        <div
          key={i}
          className={`w-10 h-10 border border-purple-500/20 flex items-center justify-center bg-black/40 backdrop-blur-sm text-xl font-mono font-bold transform transition-all duration-300 relative ${i < visibleChars ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          aria-hidden={i >= visibleChars}
        >
          {char}
        </div>
      ))}
      {showQuestion && (
        <div className="w-10 h-10 border border-purple-500/20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <span className="text-xl text-cyan-500 animate-pulse">?</span>
        </div>
      )}
    </div>
  )
}

const TypingText = ({ text, delay = 0 }) => {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev < text.length) {
            return prev + 1
          }
          clearInterval(interval)
          return prev
        })
      }, 50)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span className="inline-block min-w-[1ch]">
      {text.slice(0, visibleChars)}
      <span className="animate-blink">|</span>
    </span>
  )
}

const AnimatedStep = ({ number, title, description }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className={`w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold mb-4 transition-all duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`}>
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 max-w-xs">{description}</p>
    </div>
  )
}

export function CreativeHeroAnimated() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
        setIsChanging(false)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const currentPhrase = phrases[currentIndex]

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      <StarryBackground />
      <div className="relative container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <div className="text-gray-400 text-lg mb-2" aria-live="polite">
            <TypingText text={currentPhrase.prefix} delay={0} />
          </div>
          <div className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
            <GridText text={currentPhrase.line1} delay={800} showArrow={true} />
            <GridText text={currentPhrase.line2} delay={1600} />
            <GridText text={currentPhrase.line3} delay={2400} showQuestion={currentPhrase.suffix === '?'} />
          </div>
        </div>
        <div className="mt-15 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Create Your Website in 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedStep number={1} title="Answer Questions" description="Provide information about your business and preferences to our AI." />
            <AnimatedStep number={2} title="Customize Design" description="Personalize your website with our intuitive drag-and-drop interface." />
            <AnimatedStep number={3} title="Publish Website" description="Launch your professional website with a single click and start growing your online presence." />
          </div>
        </div>
        <div className="text-center mt-10">
        <Link href='/plan2'>
          <Button variant="default" size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-4">
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
            </Link> 
        </div>
      </div>
    </div>
  )
}