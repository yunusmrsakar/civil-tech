"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  image,
}: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col">
      {/* Image / Placeholder */}
      {image ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-slate-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-slate-300"
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

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
          {category}
        </p>
        <h3 className="mt-1 text-base font-semibold text-slate-900 line-clamp-2">
          {name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={() => addToCart({ id, name, price, image })}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
