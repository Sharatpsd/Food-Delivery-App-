import { useMemo, useState } from "react";
import { resolveMediaUrl } from "../utils/api";

const palette = [
  "from-orange-500 to-red-500",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-500",
  "from-fuchsia-500 to-rose-500",
  "from-emerald-500 to-teal-500",
];

const pickTone = (seed) => {
  const text = String(seed || "");
  const total = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length];
};

export default function SmartImage({
  src,
  alt,
  label,
  className = "",
  fallbackClassName = "",
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = useMemo(() => resolveMediaUrl(src), [src]);
  const initials = String(label || alt || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (!resolvedSrc || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${pickTone(
          label || alt
        )} text-white ${fallbackClassName || className}`}
      >
        <span className="text-lg font-black tracking-[0.18em]">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
