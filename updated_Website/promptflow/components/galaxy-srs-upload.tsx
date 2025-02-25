  // 'use client'

  // import { useState, useEffect, useRef } from 'react'
  // import { Upload, Star, Menu, FileText, X } from 'lucide-react'
  // import { Button } from "@/components/ui/button"
  // import { Input } from "@/components/ui/input"
  // import { Label } from "@/components/ui/label"
  // import { toast, useToast } from "@/components/ui/use-toast"

  // export function GalaxySrsUpload() {
  //   const [file, setFile] = useState<File | null>(null)
  //   const { toast } = useToast()
  //   const canvasRef = useRef<HTMLCanvasElement>(null)

  //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const selectedFile = e.target.files[0]
  //       const fileType = selectedFile.type
  //       if (fileType === 'application/pdf' || fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
  //         setFile(selectedFile)
  //       } else {
  //         toast({
  //           title: "Invalid file type",
  //           description: "Please upload a PDF or Word document.",
  //           variant: "destructive",
  //         })
  //       }
  //     }
  //   }

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault()
  //     if (file) {
  //       console.log('Uploaded file:', file.name)
  //       toast({
  //         title: "File uploaded successfully",
  //         description: `${file.name} has been uploaded and is being processed.`,
  //       })
  //       setFile(null)
  //     } else {
  //       toast({
  //         title: "No file selected",
  //         description: "Please select a file before submitting.",
  //         variant: "destructive",
  //       })
  //     }
  //   }

  //   useEffect(() => {
  //     const canvas = canvasRef.current
  //     const ctx = canvas?.getContext('2d')
  //     if (!canvas || !ctx) return

  //     const resizeCanvas = () => {
  //       canvas.width = window.innerWidth
  //       canvas.height = window.innerHeight
  //     }

  //     resizeCanvas()
  //     window.addEventListener('resize', resizeCanvas)

  //     const stars: { x: number; y: number; radius: number; color: string; speedX: number; speedY: number }[] = []
  //     const numStars = 100
  //     const colors = ['#ffffff']

  //     for (let i = 0; i < numStars; i++) {
  //       const r = Math.random() * 1.5 + 0.5
  //       stars.push({
  //         x: Math.random() * canvas.width,
  //         y: Math.random() * canvas.height,
  //         radius: r,
  //         color: colors[Math.floor(Math.random() * colors.length)],
  //         speedX: (Math.random() - 0.5) * 0,
  //         speedY: r * 0
  //       })
  //     }

  //     const drawStars = () => {
  //       ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  //       ctx.fillRect(0, 0, canvas.width, canvas.height)

  //       stars.forEach(star => {
  //         ctx.beginPath()
  //         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
  //         ctx.fillStyle = star.color
  //         ctx.fill()

  //         star.x += star.speedX
  //         star.y += star.speedY

  //         if (star.x < 0 || star.x > canvas.width) star.speedX *= -1
  //         if (star.y > canvas.height) {
  //           star.y = 0
  //           star.x = Math.random() * canvas.width
  //         }
  //       })
  //     }

  //     const animateStars = () => {
  //       drawStars()
  //       requestAnimationFrame(animateStars)
  //     }

  //     animateStars()

  //     return () => {
  //       window.removeEventListener('resize', resizeCanvas)
  //     }
  //   }, [])

  //   return (
  //     <div className="min-h-screen bg-black text-gray-300 flex flex-col relative overflow-hidden">
  //       <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

  //       {/* Header */}
  //       <header className="relative z-10 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center">
  //         <div className="flex items-center space-x-2">
  //           <Star className="text-yellow-400" />
  //           <span className="text-xl font-bold text-white">Prompt Flow</span>
  //         </div>
  //         <nav>
  //           <Button variant="ghost" className="text-gray-300 hover:text-white"><Menu /></Button>
  //         </nav>
  //       </header>

  //       {/* Main content */}
  //       <main className="relative z-10 flex-grow flex items-center justify-center p-4">
  //         <div className="bg-black bg-opacity-70 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-gray-800 max-w-md w-full">
  //           <h1 className="text-3xl font-bold mb-6 text-center text-white">SRS Document Upload</h1>
  //           <form onSubmit={handleSubmit} className="space-y-6">
  //             <div className="space-y-2">
  //               <Label htmlFor="srs-file" className="text-sm font-medium text-gray-300">
  //                 Upload your SRS document (PDF or Word):
  //               </Label>
  //               <div className="flex items-center justify-center w-full">
  //                 <Label
  //                   htmlFor="srs-file"
  //                   className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-black hover:bg-gray-900 transition-colors duration-300"
  //                 >
  //                   {file ? (
  //                     <div className="flex items-center space-x-2">
  //                       <FileText className="w-8 h-8 text-blue-400" />
  //                       <span className="font-medium text-gray-300">{file.name}</span>
  //                       <Button
  //                         type="button"
  //                         variant="ghost"
  //                         size="icon"
  //                         onClick={(e) => {
  //                           e.preventDefault()
  //                           setFile(null)
  //                         }}
  //                         className="text-gray-400 hover:text-gray-200"
  //                       >
  //                         <X className="w-4 h-4" />
  //                       </Button>
  //                     </div>
  //                   ) : (
  //                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
  //                       <Upload className="w-8 h-8 mb-3 text-gray-400" />
  //                       <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
  //                       <p className="text-xs text-gray-500">PDF or Word document (MAX. 10MB)</p>
  //                     </div>
  //                   )}
  //                   <Input id="srs-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
  //                 </Label>
  //               </div>
  //             </div>
  //             <div className="flex justify-center">
  //               <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
  //                 <Upload className="mr-2 h-4 w-4" />
  //                 Generate Website
  //               </Button>
  //             </div>
  //           </form>
  //         </div>
  //       </main>

  //       {/* Footer */}
  //       <footer className="relative z-10 bg-black bg-opacity-80 backdrop-blur-sm border-t border-gray-800 p-4 text-center">
  //         <p className="text-gray-500">&copy; 2024 Prompt Flow. All rights reserved.</p>
  //         <div className="mt-2">
  //           <a href="#" className="text-purple-400 hover:text-purple-300 mx-2">About</a>
  //           <a href="#" className="text-purple-400 hover:text-purple-300 mx-2">Contact</a>
  //           <a href="#" className="text-purple-400 hover:text-purple-300 mx-2">Privacy Policy</a>
  //         </div>
  //       </footer>
  //     </div>
  //   )
  // }