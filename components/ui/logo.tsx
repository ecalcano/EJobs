export function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 500 500" className="h-full w-auto">
        <path
          d="M250 50 C 180 100, 150 200, 250 250 C 350 200, 320 100, 250 50"
          fill="#E53E3E"
          stroke="none"
        />
        <path
          d="M250 100 L 270 80 C 280 70, 290 80, 280 90 L 260 110"
          fill="#E11D48"
          stroke="none"
        />
        <path
          d="M200 180 L 300 180 L 300 220 L 200 220 L 200 180"
          fill="#E11D48"
          stroke="none"
        />
        <path
          d="M220 200 L 240 200 L 240 210 L 220 210 L 220 200 M 260 200 L 280 200 L 280 210 L 260 210 L 260 200"
          fill="white"
          stroke="none"
        />
        <circle cx="250" cy="240" r="10" fill="#E11D48" />
      </svg>
      <div className="text-2xl font-bold text-red-600 whitespace-nowrap">
        GALA FOODS
      </div>
      <div className="text-lg text-red-600">SUPERMARKET</div>
    </div>
  );
}
