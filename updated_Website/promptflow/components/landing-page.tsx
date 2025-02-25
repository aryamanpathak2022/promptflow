'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Zap, Cloud, Cog, Box, Check, Phone, Mail, MessageCircle, Instagram, Facebook, DollarSign, ArrowRight, Gamepad2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
// import {images} from '@/constants'
const Star = ({ delay = 0 }) => {
  const randomSize = Math.random() * 3 + 1
  const randomOpacity = Math.random() * 0.7 + 0.3

  return (
    <motion.div
      className="absolute rounded-full bg-white star"
      animate={{ 
        opacity: [randomOpacity, 0.1, randomOpacity],
        scale: [1, 0.8, 1],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
      }}
    />
  )
}

const TypewriterText = () => {
  const texts = [
    "-> AUTOMATING EVERY STEP #",
    "% HELPING WITH YOUR ENTIRE CYCLE ->",
    "# NOW ENHANCED AND BETTER %",
    "<> HOW ABOUT PROMPT FLOW? </>"
  ]
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, 3000) // Change sentence every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-20 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTextIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap justify-center gap-1"
        >
          {texts[currentTextIndex].split("").map((char, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.1, delay: index * 0.02 }}
              className={`
                w-8 h-8 flex items-center justify-center
                border border-purple-500/20 bg-[#060028]
                rounded-md text-lg font-mono font-bold
                ${char === '<' || char === '>' ? 'text-emerald-400' : 
                  char === '#' || char === '%' || char === '-' || char === '?' ? 'text-purple-400' : 
                  'text-white'}
              `}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const Galaxy = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-32 h-32 opacity-20"
    animate={{ 
      x: [0, 100, -100, 0],
      y: [0, -50, 50, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration: 15,
      delay: delay,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
  >
    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-xl" />
  </motion.div>
)

const ShadowBubble = ({ index = 0 }) => (
  <motion.div
    className="absolute w-[40vw] h-[40vw] rounded-full bg-blue-500/10 filter blur-3xl"
    animate={{
      scale: [1, 1.2, 0.8, 1],
      x: [0, 100, -100, 0],
      y: [0, -50, 50, 0],
    }}
    transition={{
      duration: 20,
      delay: index * 5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      top: `${20 + index * 30}%`,
      left: `${10 + index * 20}%`,
    }}
  />
)

const TravelingBorder = ({ children, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 overflow-hidden">
      <div className="traveling-border"></div>
    </div>
    <div className="relative bg-[#060028] rounded-lg">
      {children}
    </div>
  </div>
)

const FeatureCard = ({ feature, index }) => (
  <motion.div 
    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 group`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <TravelingBorder className="w-full lg:w-1/2">
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/10">
        <Image 
          src={feature.image}
          alt={feature.title}
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />
        {/* Removed the purple hue overlay */}
        <feature.icon className="absolute bottom-6 left-6 w-16 h-16 text-white" />
      </div>
    </TravelingBorder>
    <div className="w-full lg:w-1/2">
      <h3 className="text-3xl font-semibold mb-6 text-white">
        {feature.title}
      </h3>
      <p className="text-white mb-8 text-xl font-light leading-relaxed">{feature.description}</p>
      <Link
        href="#"
        className="text-white hover:text-gray-300 transition-colors inline-flex items-center group text-lg"
      >
        Learn more 
        <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
)
const PricingCard = ({ plan, index }) => {
  const coinRef = useRef(null)

  useEffect(() => {
    const animateCoin = () => {
      if (coinRef.current) {
        coinRef.current.style.animation = 'none'
        coinRef.current.offsetHeight // Trigger reflow
        coinRef.current.style.animation = 'coinFlip 2s ease-out'
      }
    }

    const timeout = setTimeout(animateCoin, index * 200)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <TravelingBorder>
      <motion.div
        className="relative rounded-lg bg-[#060028] border border-white/10 p-8 flex flex-col h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        {plan.popular && (
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-medium">
            Popular
          </div>
        )}

        <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
        <div className="flex items-baseline mb-6">
          <div 
            ref={coinRef}
            className={`text-5xl font-bold text-white`}
            style={{ perspective: '1000px' }}
          >
            ${plan.price}
          </div>
          <span className="text-white ml-2">/month</span>
        </div>
        
        <ul className="space-y-4 mb-8 flex-grow">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center text-white">
              <Check className="w-5 h-5 mr-2 text-purple-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full bg-gradient-to-r ${plan.gradient} text-white px-8 py-4 rounded-full hover:opacity-90 transition-opacity text-lg mt-auto`}
        >
          Choose Plan
        </Button>
      </motion.div>
    </TravelingBorder>
  )
}

const ConnectIcon = ({ item }) => (
  <motion.a
    href={item.href}
    className="group relative flex flex-col items-center justify-center w-full h-full"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <item.icon className="w-12 h-12 text-white group-hover:text-pink-400 transition-colors duration-300" />
    <p className="mt-4 text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
      {item.label}
    </p>
  </motion.a>
)

export function LandingPageComponent() {
  const features = [
    {
      icon: Code,
      title: "Natural Language to Code Generation",
      description: "Convert natural language prompts into full project structures, including code and configuration files. Our AI understands your intent and generates production-ready code in seconds.",
      image: {
        src: "/image1.png",
        alt: "Natural Language to Code Generation",
        width: 500,
        height: 300,
      }

    },
    {
      icon: Zap,
      title: "Dynamic Web Access for Real-Time Framework Support",
      description: "Access up-to-date documentation and support for new languages or frameworks via our LLM-powered Docker container. Stay current with the latest tech without manual updates.",
      image: {
        src: "/image2.png",
        alt: "Dynamic Web Access for Real-Time Framework Support",
        width: 500,
        height: 300,
      }
    },
    {
      icon: Cloud,
      title: "Seamless Cloud Deployment Integration",
      description: "Generate cloud-ready configurations for AWS, GCP, and Kubernetes automatically. Deploy your projects with confidence, knowing they're optimized for your chosen cloud platform.",
      image: {
        src: "/image3.png",
        alt: "Seamless Cloud Deployment Integration",
        width: 500,
        height: 300,
      }
    },
    {
      icon: Cog,
      title: "End-to-End SDLC Automation",
      description: "Automate your entire software development lifecycle. From code generation to testing and deployment, PromptFlow streamlines every step of your development process.",
      image:  {
        src: "/image4.png",
        alt: "End-to-End SDLC Automation",
        width: 500,
        height: 300,
      }
    },
    {
      icon: Box,
      title: "Flexible Execution and Testing via Docker",
      description: "Execute, test, and validate projects in isolated Docker environments. Ensure consistency across different development stages and eliminate 'it works on my machine' issues.",
      image: {
        src: "/image5.png",
        alt: "Flexible Execution and Testing via Docker",
        width: 500,
        height: 300,
      }
    },
  ]

  const plans = [
    { 
      name: "Basic", 
      price: 29, 
      features: [
        "50 prompts allowed",
        "5 projects per month",
        "Basic code generation",
        "Community support",
        "Standard cloud configs",
        "Basic Docker testing"
      ],
      link:"/plan7",
      gradient: "from-blue-400 to-purple-400"
    },
    { 
      name: "Pro", 
      price: 99, 
      features: [
        "Unlimited projects",
        "Advanced code generation",
        "Priority support",
        "Cloud deployment assistance",
        "Advanced Docker integration",
        "Custom framework support"
      ],
      link:"/plan6",
      gradient: "from-purple-400 to-pink-400",
      popular: true
    },
    { 
      name: "Enterprise", 
      price: 299, 
      features: [
        "Custom solutions",
        "Dedicated account manager",
        "24/7 premium support",
        "Advanced integrations",
        "On-premise deployment option",
        "Custom AI model training"
      ],
      link:"/plan1",
      gradient: "from-pink-400 to-red-400"
    },
  ]

  const connectIcons = [
    { icon: Phone, label: 'Call Us', href: 'tel:+1234567890' },
    { icon: Mail, label: 'Email', href: 'mailto:info@promptflow.ai' },
    { icon: Gamepad2, label: 'Discord', href: 'https://discord.gg/promptflow' },
    { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/1234567890' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/promptflow' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/promptflow' },
  ]

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              PromptFlow
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {[...Array(400)].map((_, i) => (
            <Star key={`star-${i}`} delay={i * 0.02} />
          ))}
          {[...Array(8)].map((_, i) => (
            <Galaxy key={`galaxy-${i}`} delay={i * 2} />
          ))}
          {[...Array(3)].map((_, i) => (
            <ShadowBubble key={`bubble-${i}`} index={i} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              className="inline-block px-6 py-2 rounded-full text-sm bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              Revolutionize Your Development Workflow
            </motion.div>

            <TypewriterText />

            <p className="text-xl md:text-2xl text-white mb-12 mt-8">
              Transform your ideas into reality with our cutting-edge AI technology. PromptFlow streamlines your entire development process, from concept to deployment.
            </p>
            <Link href='/plan1'>
            <Button
              className="bg-white text-black px-12 py-6 rounded-full hover:bg-opacity-90 transition-opacity text-xl shadow-lg"
            >
              Get Started Free
            </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
            Powerful Features
          </h2>
          <div className="space-y-32">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
      Choose Your Plan
    </h2>
    <div className="flex flex-col md:flex-row gap-8 max-w-full mx-auto">
      {plans.map((plan, index) => (
        <div key={index} className="flex-1">
          <Link href={plan.link} passHref>
            {/* <a className="block"> */}
              <PricingCard plan={plan} index={index} />
            {/* </a> */}
          </Link>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Connect Section */}
      <section id="connect" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-white">
            Connect With Us
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {connectIcons.map((item, index) => (
              <ConnectIcon key={index} item={item} />
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-xl text-white mb-8">Ready to transform your development workflow?</p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">&copy; 2023 PromptFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}