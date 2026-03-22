import { prisma } from "@/lib/prisma"
import StatusSelect from "@/components/admin/StatusSelect"

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage() {
  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Requests</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Project Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Budget</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{req.name}</td>
                    <td className="px-4 py-3 text-slate-600">{req.email}</td>
                    <td className="px-4 py-3 text-slate-600">{req.projectType}</td>
                    <td className="px-4 py-3 text-slate-600">{req.budget || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        id={req.id}
                        currentStatus={req.status}
                        statusOptions={["NEW", "REVIEWED", "CONTACTED", "CLOSED"]}
                        apiEndpoint="/api/requests"
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
