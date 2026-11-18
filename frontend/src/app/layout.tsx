import type { Metadata } from "next";
import "./globals.css";
import { TableSessionProvider } from "../context/TableSessionContext";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "KICK BUNK — Where Flavours Meet Extraordinary Experiences",
  description: "European Luxury Dining, Live Charcoal Tandoor Gastronomy, Handcrafted Nightlife Mixology, and Private Cabanas in Bengaluru & Tirupati.",
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#382D25] font-sans antialiased">
        <TableSessionProvider>
          <CartProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </CartProvider>
        </TableSessionProvider>
      </body>
    </html>
  );
}
