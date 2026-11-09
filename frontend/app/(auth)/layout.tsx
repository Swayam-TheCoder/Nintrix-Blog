import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#08090c] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <header className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <BookOpen size={18} />
            </div>

            <span className="font-semibold tracking-tight">
              NintrixBlog
            </span>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          {children}
        </div>
      </div>
    </main>
  );
}