/**
 * Logo Component
 * Unified logo component used across the application
 * Uses the Tauri SVG logo image
 */
import { useTranslation } from "react-i18next";

interface LogoProps {
  /** Show "Smart School" text next to logo */
  showText?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

const sizeConfig = {
  sm: {
    image: "w-6 h-6",
    brandText: "text-sm",
  },
  md: {
    image: "w-10 h-10",
    brandText: "text-base",
  },
  lg: {
    image: "w-14 h-14",
    brandText: "text-xl",
  },
};

export function Logo({
  showText = true,
  size = "md",
  className = "",
}: LogoProps) {
  const { t } = useTranslation();
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/tauri.svg"
        alt="Logo"
        className={`${config.image} ${showText ? "mr-2" : ""}`}
      />
      {showText && (
        <p className={`font-bold text-inherit ${config.brandText}`}>
          {t("app.name")}
        </p>
      )}
    </div>
  );
}
