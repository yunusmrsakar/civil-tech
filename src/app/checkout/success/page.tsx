import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        {/* Checkmark Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">Order Confirmed!</h1>
        <p className="mt-4 text-lg text-slate-600">
          Your order has been placed successfully.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          A confirmation email will be sent to you shortly with your order details.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-7 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
