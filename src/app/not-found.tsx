import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-[#F5EEDB] text-[#133020]">
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#133020] text-white rounded-md hover:bg-[#1f4d34] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
