import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteButton from "@/components/admin/DeleteButton"

export const dynamic = 'force-dynamic'

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 text-sm font-medium transition-colors"
        >
          Add Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Client</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Featured</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{t.clientName}</td>
                    <td className="px-4 py-3 text-slate-600">{t.company}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </td>
                    <td className="px-4 py-3">
                      {t.featured ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <Link
                        href={`/admin/testimonials/${t.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={t.id}
                        apiEndpoint="/api/testimonials"
                        entityName="testimonial"
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
