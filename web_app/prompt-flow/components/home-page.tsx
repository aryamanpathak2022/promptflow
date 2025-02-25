'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Cloud, Zap, Box } from 'lucide-react'
import { ChatPageComponent } from './chat-page'
// import naturalLanguageImage from '../images/natural_language_to_code_generation.png';

const features = [
  {
    title: "Natural Language to Code Generation",
    description: "Convert natural language prompts into full project structures, including code and configuration files. Simplify development for technical and non-technical users alike.",
    image: "/natural_language_to_code_generation.png?height=400&width=600",
    icon: <Code className="w-8 h-8 text-blue-500" />
  },
  {
    title: "Dynamic Web Access for Real-Time Framework Support",
    description: "Access up-to-date documentation and support for new languages or frameworks via our LLM-powered Docker container. Stay compatible with the latest tools and technologies.",
    image: "/coder_background.png?height=400&width=600",
    icon: <Cloud className="w-8 h-8 text-green-500" />
  },
  {
    title: "Seamless Cloud Deployment Integration",
    description: "Generate cloud-ready configurations for AWS, GCP, and Kubernetes automatically. Enjoy quick and scalable deployments with reduced manual setup.",
    image: "/cloud.png?height=400&width=600",
    icon: <Zap className="w-8 h-8 text-yellow-500" />
  },
  {
    title: "End-to-End SDLC Automation",
    description: "Automate your entire software development lifecycle. From code generation to testing and deployment, integrate CI/CD pipelines for a streamlined workflow.",
    image: "/machine.png?height=200&width=600",
    icon: <ArrowRight className="w-8 h-8 text-purple-500" />
  },
  {
    title: "Flexible Execution and Testing via Docker",
    description: "Execute, test, and validate projects in isolated Docker environments. Ensure consistency across development stages and reduce local setup requirements.",
    image: "/bg.png?height=400&width=600",
    icon: <Box className="w-8 h-8 text-red-500" />
  }
]

export function HomePageComponent() {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-b from-white to-gray-50 font-sans ">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/terminal.png?height=4&width=4" alt="Prompt Flow Logo" className="mr-4 h-7 w-7" />
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Prompt Flow</h1>
          </div>
          <nav>
            <Button variant="ghost" className="text-gray-600 mr-4 hover:text-blue-500 transition-colors">About</Button>
            <Button variant="ghost" className="text-gray-600 mr-4 hover:text-blue-500 transition-colors">Docs</Button>
            <Link href="/chat-page">
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <section className="mb-24 text-center">
          <motion.h2 
            className="text-5xl font-bold text-gray-800 mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Revolutionize Your <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Development Workflow</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Prompt Flow is an innovative AI-powered platform that streamlines the entire software development lifecycle, from code generation to deployment. Experience the future of coding today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/chat-page" passHref>
  
    <Button className="bg-blue-500 text-white hover:bg-blue-600 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      Start Building
      <ArrowRight className="ml-2 w-5 h-5" />
    </Button>
  
</Link>

          </motion.div>
        </section>

        {features.map((feature, index) => (
          <motion.section 
            key={index} 
            className="mb-24 flex flex-col md:flex-row items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className={`w-full md:w-1/2 mt-8 md:mt-0 ${index % 2 === 0 ? 'md:order-2 md:pl-12' : 'md:order-1 md:pr-12'}`}>
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-3xl font-bold text-gray-800 ml-4">{feature.title}</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
              <Button variant="link" className="mt-4 text-blue-500 hover:text-blue-600 p-0">
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.section>
        ))}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-4">Prompt Flow</h4>
            <p className="text-gray-400">Revolutionizing software development with AI-powered solutions.</p>
          </div>
          <div>
            <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xl font-semibold mb-4">Stay Connected</h5>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none" />
              <Button className="bg-blue-500 text-white rounded-r-md hover:bg-blue-600">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prompt Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}