'use client'

import React, { createContext, useContext, useState } from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

type ToastProps = {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

type ToastContextType = {
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: ToastProps) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast, index) => (
          <Toast key={index} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  
  return context
}

function Toast({ title, description, variant = 'default' }: ToastProps) {
  return (
    <div
      className={`p-4 rounded-lg shadow-lg flex items-start gap-2 ${
        variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="flex-grow">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {}}
        className={variant === 'destructive' ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}