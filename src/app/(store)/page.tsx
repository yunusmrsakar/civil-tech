import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import TestimonialCard from "@/components/testimonials/TestimonialCard";

export const dynamic = 'force-dynamic'

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
}

interface FeaturedTestimonial {
  id: string;
  content: string;
  clientName: string;
  company: string;
  rating: number;
}

const stats = [
  { label: "Years Experience", value: "15+", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Projects Completed", value: "500+", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Products Available", value: "100+", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "24/7 Support", value: "24/7", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
];

export default async function HomePage() {
  let featuredProducts: FeaturedProduct[] = [];
  let featuredTestimonials: FeaturedTestimonial[] = [];

  try {
    featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    featuredTestimonials = await prisma.testimonial.findMany({
      where: { featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not available — render page with empty data
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Civil Technology Solutions for Modern Infrastructure
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
              Providing high-quality civil engineering products, equipment, and professional
              services to power your construction and infrastructure projects.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-7 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Browse Products
              </Link>
              <Link
                href="/request"
                className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-7 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="mt-3 text-lg text-slate-600">
              Explore our top-rated civil engineering products
            </p>
          </div>
          <ProductGrid>
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  category={product.category.name}
                  price={product.price}
                  image={product.images[0]}
                />
              </Link>
            ))}
          </ProductGrid>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              View All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Us</h2>
            <p className="mt-3 text-lg text-slate-600">
              Trusted by engineers and contractors nationwide
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {featuredTestimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">What Our Clients Say</h2>
            <p className="mt-3 text-lg text-slate-600">
              Hear from engineers and project managers who trust our products
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                content={testimonial.content}
                clientName={testimonial.clientName}
                company={testimonial.company}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Start Your Project?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Get in touch with our team for expert guidance on selecting the right products
              and services for your civil engineering needs.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Book a Consultation
              </Link>
              <Link
                href="/request"
                className="inline-flex items-center justify-center rounded-lg border border-blue-300 px-7 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
