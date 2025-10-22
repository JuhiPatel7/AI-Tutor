"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ChatInterfaceProps {
  pdfId: string
  pdfContent: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface({ pdfId, pdfContent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("user_id", user.id)
          .eq("pdf_id", pdfId)
          .order("created_at", { ascending: true })

        if (data && !error) {
          setMessages(
            data.map((msg) => ({
              id: msg.id,
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          )
        }
      }
    }
    loadMessages()
  }, [pdfId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Save user message to database
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("messages").insert({
          user_id: user.id,
          pdf_id: pdfId,
          role: "user",
          content: userMessage.content,
        })
      }

      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          pdfContent,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to get AI response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save assistant message to database
      if (user) {
        await supabase.from("messages").insert({
          user_id: user.id,
          pdf_id: pdfId,
          role: "assistant",
          content: assistantMessage.content,
        })
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to get response from AI"
      toast.error(errorMessage)

      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in your browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      toast.info("Listening... Speak now")
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      toast.success("Voice input captured!")
    }

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      toast.error("Failed to capture voice input")
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat Header */}
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">AI Tutor Chat</h2>
        <p className="text-xs text-muted-foreground">Ask questions about your document</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Start a conversation with your AI tutor</p>
              <p className="text-xs text-muted-foreground">Ask questions about the document</p>
              <div className="mt-4 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                <p className="text-xs text-muted-foreground">"Summarize this document"</p>
                <p className="text-xs text-muted-foreground">"Explain the main concepts"</p>
                <p className="text-xs text-muted-foreground">"What are the key takeaways?"</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="button" size="icon" variant="outline" onClick={handleVoiceInput} disabled={isListening}>
            <Mic className={`h-4 w-4 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">Click the microphone to use voice input</p>
      </div>
    </div>
  )
}
