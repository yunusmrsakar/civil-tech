interface TestimonialCardProps {
  content: string;
  clientName: string;
  company: string;
  rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${
            star <= rating ? "text-amber-400" : "text-slate-200"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({
  content,
  clientName,
  company,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Quote Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-3 h-8 w-8 text-blue-100"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
      </svg>

      {/* Content */}
      <p className="mb-4 text-sm leading-relaxed text-slate-600">{content}</p>

      {/* Rating */}
      <StarRating rating={rating} />

      {/* Client Info */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-900">{clientName}</p>
        <p className="text-xs text-slate-500">{company}</p>
      </div>
    </div>
  );
}
