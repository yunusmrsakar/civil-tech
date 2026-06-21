import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import AddToCartButton from "@/components/products/AddToCartButton";

export const dynamic = 'force-dynamic'

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  categoryId: string;
  category: { name: string; slug: string };
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  const product: ProductDetail | null = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts: RelatedProduct[] = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/products" className="transition-colors hover:text-blue-600">
          Products
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="transition-colors hover:text-blue-600"
        >
          {product.category.name}
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-slate-900">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          {product.images.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
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
          {/* Thumbnail Row */}
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img: string, i: number) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-slate-200"
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {product.category.name}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>

          {/* Stock Status */}
          <div className="mt-4 flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-700">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-700">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-3 leading-relaxed text-slate-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            {product.stock > 0 ? (
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images[0]}
              />
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-lg bg-slate-200 px-7 py-3 text-base font-medium text-slate-500"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">Related Products</h2>
          <ProductGrid>
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <ProductCard
                  id={p.id}
                  name={p.name}
                  category={p.category.name}
                  price={p.price}
                  image={p.images[0]}
                />
              </Link>
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}
