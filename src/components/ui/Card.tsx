import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  image,
  imageAlt = "",
  className = "",
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
        onClick ? "cursor-pointer text-left w-full" : ""
      } ${className}`}
      onClick={onClick}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
      {children}
    </Component>
  );
}
