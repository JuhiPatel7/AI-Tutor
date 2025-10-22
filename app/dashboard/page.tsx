import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's PDF files
  const { data: pdfFiles } = await supabase
    .from("pdf_files")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <DashboardClient user={user} initialPdfFiles={pdfFiles || []} />
}
