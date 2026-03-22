import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

interface PortfolioDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  client: string;
  completedAt: Date;
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  const portfolio: PortfolioDetail | null = await prisma.portfolio.findUnique({
    where: { slug },
  });

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/portfolio"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Portfolio
      </Link>

      {/* Hero Image */}
      {portfolio.images.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <img
            src={portfolio.images[0]}
            alt={portfolio.title}
            className="h-[400px] w-full object-cover lg:h-[500px]"
          />
        </div>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 lg:h-[500px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-slate-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Project Info */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-slate-900">{portfolio.title}</h1>
          <p className="mt-6 leading-relaxed text-slate-600 whitespace-pre-line">
            {portfolio.description}
          </p>
        </div>

        {/* Sidebar Info */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 h-fit">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Project Details
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Client</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{portfolio.client}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Completion Date</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {new Date(portfolio.completedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {portfolio.images.length > 1 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Project Gallery</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.images.slice(1).map((img: string, i: number) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-slate-200"
              >
                <img
                  src={img}
                  alt={`${portfolio.title} - Image ${i + 2}`}
                  className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
