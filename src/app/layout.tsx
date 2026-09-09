import "@/app/globals.css";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "Lifewood Exhibition Dashboard",
  description: "Global Tech Exhibition Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5EEDB] text-[#133020] antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
