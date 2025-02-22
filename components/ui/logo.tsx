import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/jobs" className={`block ${className}`}>
      <div className="relative aspect-[2/1]">
        <Image
          src="/images/gala-foods-logo.png"
          alt="Gala Foods Logo"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px"
        />
      </div>
    </Link>
  );
}
