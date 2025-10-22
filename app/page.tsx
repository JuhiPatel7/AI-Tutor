import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Upload, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Tutor</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center">
          <div className="flex flex-col items-center gap-4 max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Learn Smarter with AI-Powered Study Assistance
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl">
              Upload your study materials and chat with an AI tutor that understands your documents. Get instant
              answers, explanations, and study help.
            </p>
            <div className="flex gap-4 mt-4">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Start Learning Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full max-w-5xl">
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Upload PDFs</h3>
              <p className="text-sm text-muted-foreground text-center">
                Upload your study materials, textbooks, and notes
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">View Documents</h3>
              <p className="text-sm text-muted-foreground text-center">Read your PDFs with an intuitive viewer</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Ask Questions</h3>
              <p className="text-sm text-muted-foreground text-center">Chat with AI about your study materials</p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Get Answers</h3>
              <p className="text-sm text-muted-foreground text-center">Receive instant, context-aware explanations</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">Built with Next.js, Supabase, and OpenAI</p>
        </div>
      </footer>
    </div>
  )
}
