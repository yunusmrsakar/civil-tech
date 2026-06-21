import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dünya Kupası 2026 - Tahmin Oyunu',
  description: 'FIFA Dünya Kupası 2026 tahmin oyunu. Maç skorlarını tahmin et, puan kazan!',
};

export default function WorldCupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f0f4e8]">
      {children}
    </div>
  );
}
