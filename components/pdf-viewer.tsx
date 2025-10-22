"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Highlighter, Underline, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

interface Annotation {
  id: string
  type: "highlight" | "underline"
  color: string
  text_content?: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  page_number: number
}

interface PdfViewerProps {
  pdfUrl: string
  pdfName: string
  pdfId: string
  pageCount: number
}

export default function PdfViewer({ pdfUrl, pdfName, pdfId, pageCount }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  const [annotationMode, setAnnotationMode] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadAnnotations()
  }, [currentPage, pdfId])

  const loadAnnotations = async () => {
    const { data, error } = await supabase
      .from("annotations")
      .select("*")
      .eq("pdf_id", pdfId)
      .eq("page_number", currentPage)

    if (error) {
      console.error("Error loading annotations:", error)
      return
    }

    setAnnotations(data || [])
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!annotationMode) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsSelecting(true)
    setSelectionStart({ x, y })
    setSelectionEnd({ x, y })
    setShowMenu(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !annotationMode) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setSelectionEnd({ x, y })
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return

    setIsSelecting(false)

    const width = Math.abs(selectionEnd.x - selectionStart.x)
    const height = Math.abs(selectionEnd.y - selectionStart.y)

    if (width > 20 && height > 10) {
      const x = Math.min(selectionStart.x, selectionEnd.x)
      const y = Math.min(selectionStart.y, selectionEnd.y)

      setSelectionBox({ x, y, width, height })
      setMenuPosition({ x: x + width / 2, y: y + height + 10 })
      setShowMenu(true)
    }
  }

  const createAnnotation = async (type: "highlight" | "underline", color: string) => {
    if (!selectionBox) return

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return

    const annotationData = {
      user_id: user.user.id,
      pdf_id: pdfId,
      page_number: currentPage,
      type,
      color,
      text_content: `${type} annotation`,
      position: selectionBox,
    }

    const { data, error } = await supabase.from("annotations").insert(annotationData).select().single()

    if (error) {
      toast.error("Failed to save annotation")
      console.error("Error saving annotation:", error)
      return
    }

    setAnnotations([...annotations, data])
    toast.success("Annotation added")
    setShowMenu(false)
    setSelectionBox(null)
  }

  const deleteAnnotation = async (annotationId: string) => {
    const { error } = await supabase.from("annotations").delete().eq("id", annotationId)

    if (error) {
      toast.error("Failed to delete annotation")
      return
    }

    setAnnotations(annotations.filter((a) => a.id !== annotationId))
    toast.success("Annotation deleted")
  }

  const currentSelection = isSelecting
    ? {
        x: Math.min(selectionStart.x, selectionEnd.x),
        y: Math.min(selectionStart.y, selectionEnd.y),
        width: Math.abs(selectionEnd.x - selectionStart.x),
        height: Math.abs(selectionEnd.y - selectionStart.y),
      }
    : null

  return (
    <div className="flex h-full flex-col bg-muted/30">
      {/* PDF Viewer Header */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">{pdfName}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="annotation-mode" checked={annotationMode} onCheckedChange={setAnnotationMode} />
            <label htmlFor="annotation-mode" className="text-sm font-medium cursor-pointer">
              Annotations {annotationMode ? "ON" : "OFF"}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b bg-background px-4 py-2">
        <p className="text-sm text-muted-foreground">
          {annotationMode
            ? "Click and drag to select text, then choose highlight or underline"
            : "Turn on annotations to start annotating"}
        </p>
      </div>

      {/* PDF Viewer with Annotations */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl relative">
          <iframe
            src={`${pdfUrl}#page=${currentPage}`}
            className="w-full h-[800px] rounded-lg border bg-white shadow-sm"
            title={pdfName}
          />

          <div
            className="absolute top-0 left-0 w-full h-[800px]"
            style={{ cursor: annotationMode ? "crosshair" : "default" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {currentSelection && currentSelection.width > 0 && currentSelection.height > 0 && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-200/30 pointer-events-none"
                style={{
                  left: currentSelection.x,
                  top: currentSelection.y,
                  width: currentSelection.width,
                  height: currentSelection.height,
                }}
              />
            )}

            {/* Existing annotations */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute group pointer-events-auto"
                style={{
                  left: annotation.position.x,
                  top: annotation.position.y,
                  width: annotation.position.width,
                  height: annotation.position.height,
                  backgroundColor: annotation.type === "highlight" ? annotation.color : "transparent",
                  borderBottom: annotation.type === "underline" ? `3px solid ${annotation.color}` : "none",
                  opacity: 0.4,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteAnnotation(annotation.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {showMenu && selectionBox && (
              <div
                className="absolute bg-background border rounded-lg shadow-lg p-2 z-50 flex gap-2"
                style={{ left: menuPosition.x - 100, top: menuPosition.y }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Highlight options */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium mb-1 text-center">Highlight</p>
                  <div className="flex gap-1">
                    {["#FFFF00", "#FF6B6B", "#4ECDC4", "#95E1D3"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-muted hover:scale-110 transition-all flex items-center justify-center"
                        style={{ backgroundColor: color }}
                        onClick={() => createAnnotation("highlight", color)}
                        title="Highlight"
                      >
                        <Highlighter className="h-4 w-4 text-gray-700" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-l" />

                {/* Underline options */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium mb-1 text-center">Underline</p>
                  <div className="flex gap-1">
                    {["#FF0000", "#0000FF", "#00FF00", "#FF00FF"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-muted hover:scale-110 transition-all flex items-center justify-center"
                        style={{ borderBottomColor: color, borderBottomWidth: 3 }}
                        onClick={() => createAnnotation("underline", color)}
                        title="Underline"
                      >
                        <Underline className="h-4 w-4" style={{ color }} />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-2"
                  onClick={() => {
                    setShowMenu(false)
                    setSelectionBox(null)
                  }}
                >
                  ✕
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
