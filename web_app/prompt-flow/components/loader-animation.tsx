"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const messages = [
  "Analysing your prompt",
  "Generating the necessary langchain model",
  "Integrating Your code",
  "Generating the github repo",
  "Publishing the files to docker modules",
  "Finalising Your Client Requests",
]

export function LoaderAnimation() {
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-6">
      <div className="w-10 h-10 relative"> {/* Decreased size of the animation (from w-32 h-32 to w-24 h-24) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4285F4" stopOpacity="0" />
              <stop offset="50%" stopColor="#4285F4" stopOpacity="1" />
              <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA4335" stopOpacity="0" />
              <stop offset="50%" stopColor="#EA4335" stopOpacity="1" />
              <stop offset="100%" stopColor="#EA4335" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBC05" stopOpacity="0" />
              <stop offset="50%" stopColor="#FBBC05" stopOpacity="1" />
              <stop offset="100%" stopColor="#FBBC05" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34A853" stopOpacity="0" />
              <stop offset="50%" stopColor="#34A853" stopOpacity="1" />
              <stop offset="100%" stopColor="#34A853" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M10,50 Q50,10 90,50"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M10,50 Q50,90 90,50"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M50,10 Q90,50 50,90"
            fill="none"
            stroke="url(#gradient3)"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.line
            x1="10" y1="20" x2="90" y2="20"
            stroke="url(#gradient1)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line
            x1="10" y1="40" x2="90" y2="40"
            stroke="url(#gradient2)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.line
            x1="10" y1="60" x2="90" y2="60"
            stroke="url(#gradient3)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.line
            x1="10" y1="80" x2="90" y2="80"
            stroke="url(#gradient4)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </svg>
      </div>
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-700 font-medium"
          >
            {messages[currentMessage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
