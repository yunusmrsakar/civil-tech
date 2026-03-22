import { prisma } from "@/lib/prisma"
import StatusSelect from "@/components/admin/StatusSelect"

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{booking.name}</td>
                    <td className="px-4 py-3 text-slate-600">{booking.email}</td>
                    <td className="px-4 py-3 text-slate-600">{booking.service}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{booking.timeSlot}</td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        id={booking.id}
                        currentStatus={booking.status}
                        statusOptions={["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]}
                        apiEndpoint="/api/bookings"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
