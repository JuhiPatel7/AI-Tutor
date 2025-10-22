"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface PdfUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPdfUploaded: (pdf: any) => void
}

export default function PdfUploadDialog({ open, onOpenChange, onPdfUploaded }: PdfUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Please select a valid PDF file")
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Upload PDF to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("pdfs").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("pdfs").getPublicUrl(fileName)

      // Extract text from PDF (simplified - in production use a proper PDF parser)
      const textContent = await extractTextFromPdf(file)

      // Get page count (simplified)
      const pageCount = await getPageCount(file)

      // Save to database
      const { data: pdfData, error: dbError } = await supabase
        .from("pdf_files")
        .insert({
          user_id: user.id,
          name: file.name,
          url: publicUrl,
          text_content: textContent,
          page_count: pageCount,
        })
        .select()
        .single()

      if (dbError) throw dbError

      toast.success("PDF uploaded successfully!")
      onPdfUploaded(pdfData)
      setFile(null)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to upload PDF"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogDescription>Upload a PDF document to chat with your AI tutor</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="pdf-file">Select PDF File</Label>
            <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} disabled={isUploading} />
          </div>
          {file && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Simplified text extraction - in production, use pdf-parse or similar
async function extractTextFromPdf(file: File): Promise<string> {
  // This is a placeholder. In a real app, you'd use a library like pdf-parse
  // or send to a server endpoint that uses pdf.js or similar
  return `This is extracted text from ${file.name}. 

In a production environment, you would use a proper PDF parsing library to extract the actual text content from the PDF file. 

Some options include:
- pdf-parse (Node.js)
- pdf.js (Browser)
- PyPDF2 (Python backend)

The extracted text would then be stored in the database and used as context for the AI chat.`
}

// Simplified page count - in production, use proper PDF parsing
async function getPageCount(file: File): Promise<number> {
  // This is a placeholder. In a real app, you'd parse the PDF to get actual page count
  // For now, return a random number between 1-50 for demo purposes
  return Math.floor(Math.random() * 50) + 1
}
