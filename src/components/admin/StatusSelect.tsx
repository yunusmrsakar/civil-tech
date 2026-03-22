"use client"

import { useState } from "react"

interface StatusSelectProps {
  id: string
  currentStatus: string
  statusOptions: string[]
  apiEndpoint: string
}

export default function StatusSelect({
  id,
  currentStatus,
  statusOptions,
  apiEndpoint,
}: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setLoading(true)
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded border px-2 py-1 text-sm font-medium ${
        loading ? "opacity-50 cursor-wait" : "cursor-pointer"
      }`}
    >
      {statusOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
