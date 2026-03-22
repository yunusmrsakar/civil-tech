"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
  id: string
  apiEndpoint: string
  entityName: string
}

export default function DeleteButton({
  id,
  apiEndpoint,
  entityName,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${entityName}?`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert(`Failed to delete ${entityName}`)
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert(`Failed to delete ${entityName}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}
