/**
 * Logo Component
 * Unified logo component used across the application
 * Renders only the SVG/logo image. Accepts `width` and `height` (pixels).
 */
interface LogoProps {
  /** Width in pixels (default 36) */
  width?: number;
  /** Height in pixels (default 36) */
  height?: number;
  /** Backwards-compatible: size variant (optional, deprecated) */
  size?: "sm" | "md" | "lg";
  /** Backwards-compatible: show text (ignored) */
  showText?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const presetSizeMap: Record<string, { w: number; h: number }> = {
  sm: { w: 24, h: 24 },
  md: { w: 40, h: 40 },
  lg: { w: 56, h: 56 },
};

export function Logo({
  width,
  height,
  size = "md",
  showText: _showText, // ignored on purpose
  className = "",
}: LogoProps) {
  // Determine final dimensions: explicit props take priority, otherwise map from size, otherwise default 36
  const finalWidth = width ?? presetSizeMap[size]?.w ?? 36;
  const finalHeight = height ?? presetSizeMap[size]?.h ?? 36;

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/tauri.svg"
        alt="Logo"
        width={finalWidth}
        height={finalHeight}
        style={{ width: finalWidth, height: finalHeight }}
      />
    </div>
  );
}
