export default function BeltBadge({ belt, ...props }: { belt: string, [key: string]: any }) {
  const colors: Record<string, string> = {
    white: "bg-white text-black",
    yellow: "bg-yellow-400 text-black",
    orange: "bg-orange-500 text-white",
    green: "bg-green-500 text-white",
    blue: "bg-blue-500 text-white",
    purple: "bg-purple-500 text-white",
    brown: "bg-amber-800 text-white",
    red: "bg-red-600 text-white",
    black_1: "bg-black text-white border border-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-heading font-bold uppercase tracking-widest ${colors[belt] || colors.white}`}>
      {belt.replace("_", " ")}
    </span>
  );
}
