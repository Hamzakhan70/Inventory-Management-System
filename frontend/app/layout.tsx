import "./globals.css";
import Providers from "@/components/Providers";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
        <Providers>
          {children}
        </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
