"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { LogOut, Upload, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import PdfUploadDialog from "@/components/pdf-upload-dialog"
import PdfViewer from "@/components/pdf-viewer"
import ChatInterface from "@/components/chat-interface"

interface PdfFile {
  id: string
  name: string
  url: string
  text_content: string
  page_count: number
  created_at: string
}

interface DashboardClientProps {
  user: User
  initialPdfFiles: PdfFile[]
}

export default function DashboardClient({ user, initialPdfFiles }: DashboardClientProps) {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>(initialPdfFiles)
  const [selectedPdf, setSelectedPdf] = useState<PdfFile | null>(initialPdfFiles[0] || null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handlePdfUploaded = (newPdf: PdfFile) => {
    setPdfFiles([newPdf, ...pdfFiles])
    setSelectedPdf(newPdf)
    setIsUploadOpen(false)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">AI Tutor</h1>
          <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - PDF List */}
        <aside className="w-64 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground">My Documents</h2>
            <div className="space-y-2">
              {pdfFiles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No documents yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-transparent"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    Upload your first PDF
                  </Button>
                </div>
              ) : (
                pdfFiles.map((pdf) => (
                  <button
                    key={pdf.id}
                    onClick={() => setSelectedPdf(pdf)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                      selectedPdf?.id === pdf.id ? "bg-accent border-primary" : "bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{pdf.name}</p>
                        <p className="text-xs text-muted-foreground">{pdf.page_count} pages</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Split View - PDF Viewer and Chat */}
        {selectedPdf ? (
          <div className="flex flex-1 overflow-hidden">
            {/* PDF Viewer - Left Side */}
            <div className="flex-1 border-r overflow-hidden">
              <PdfViewer
                pdfUrl={selectedPdf.url}
                pdfName={selectedPdf.name}
                pdfId={selectedPdf.id}
                pageCount={selectedPdf.page_count}
              />
            </div>

            {/* Chat Interface - Right Side */}
            <div className="w-[500px] flex flex-col">
              <ChatInterface pdfId={selectedPdf.id} pdfContent={selectedPdf.text_content} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No document selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">Upload a PDF to get started</p>
              <Button className="mt-4" onClick={() => setIsUploadOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      <PdfUploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} onPdfUploaded={handlePdfUploaded} />
    </div>
  )
}
