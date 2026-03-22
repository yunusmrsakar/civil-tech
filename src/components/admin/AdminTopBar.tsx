"use client"

import { signOut } from "next-auth/react"

interface AdminTopBarProps {
  userName: string
}

export default function AdminTopBar({ userName }: AdminTopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
      <div className="lg:hidden w-10" />
      <h1 className="text-lg font-semibold text-slate-800 hidden lg:block">
        Admin Panel
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">{userName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
