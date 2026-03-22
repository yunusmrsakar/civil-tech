import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center text-slate-500">
            No orders found.
          </div>
        ) : (
          orders.map((order) => {
            const items = (order.items as unknown as OrderItem[]) || []

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-slate-500">Order ID</p>
                      <p className="text-sm font-mono text-slate-700">
                        {order.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm text-slate-700">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-sm text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-slate-800">
                      ${order.total.toFixed(2)}
                    </p>
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        statusColors[order.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Items</p>
                    <div className="space-y-1">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-700">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-slate-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
