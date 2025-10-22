import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { messages, pdfContent } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const systemPrompt = `You are an AI tutor helping a student understand their study materials. 
Here is the content from their PDF document:

${pdfContent}

Based on this content, answer the student's questions clearly and helpfully. 
If the question is not related to the document, politely guide them back to the material.
Provide explanations, examples, and break down complex concepts when needed.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return Response.json({ error: `Failed to get AI response: ${errorMessage}` }, { status: 500 })
  }
}
