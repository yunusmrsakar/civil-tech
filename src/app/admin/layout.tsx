import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminTopBar from "@/components/admin/AdminTopBar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-next-pathname") || ""

  // Allow login page to render without auth
  const isLoginPage = pathname.includes("/admin/login")

  const session = await auth()

  if (!session && !isLoginPage) {
    redirect("/admin/login")
  }

  // Login page gets its own layout without sidebar
  if (!session || isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminTopBar userName={session.user?.name || "Admin"} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
