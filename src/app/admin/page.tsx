import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [productCount, orderCount, pendingBookings, newRequests, recentOrders, recentBookings] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.request.count({ where: { status: "NEW" } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ])

  const stats = [
    { label: "Total Products", value: productCount, href: "/admin/products", color: "bg-blue-50 text-blue-700" },
    { label: "Total Orders", value: orderCount, href: "/admin/orders", color: "bg-green-50 text-green-700" },
    { label: "Pending Bookings", value: pendingBookings, href: "/admin/bookings", color: "bg-yellow-50 text-yellow-700" },
    { label: "New Requests", value: newRequests, href: "/admin/requests", color: "bg-purple-50 text-purple-700" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Welcome to the Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color} inline-block px-2 py-1 rounded`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.length === 0 ? (
              <p className="p-4 text-slate-500 text-sm">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{order.email}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      ${order.total.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentBookings.length === 0 ? (
              <p className="p-4 text-slate-500 text-sm">No bookings yet</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{booking.name}</p>
                    <p className="text-xs text-slate-500">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
