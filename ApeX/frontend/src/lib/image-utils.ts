/**
 * Image optimization utilities
 * Helper functions for image optimization and accessibility
 */

/**
 * Generate a blur data URL for image placeholder
 * @param width - Image width
 * @param height - Image height
 * @param color - Background color (default: #e5e7eb)
 */
export function generateBlurDataURL(
  width: number,
  height: number,
  color: string = "#e5e7eb"
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
  }
  
  return "";
}

/**
 * Generate responsive image sizes attribute
 * @param breakpoints - Array of breakpoint widths
 * @param maxWidth - Maximum image width
 */
export function generateSizes(breakpoints: number[], maxWidth: number): string {
  return breakpoints
    .map((bp, index) => {
      const nextBp = breakpoints[index + 1] || maxWidth;
      return `(max-width: ${bp}px) ${nextBp}px`;
    })
    .join(", ");
}

/**
 * Validate and sanitize alt text
 * @param alt - Alt text to validate
 * @returns Sanitized alt text
 */
export function sanitizeAltText(alt: string): string {
  return alt.trim().slice(0, 125); // Limit to 125 characters for accessibility
}

/**
 * Check if image is decorative (can have empty alt)
 * @param context - Image context/usage
 */
export function isDecorativeImage(context: string): boolean {
  const decorativeContexts = [
    "background",
    "pattern",
    "separator",
    "decoration",
    "icon-only",
  ];
  return decorativeContexts.some((dc) => context.toLowerCase().includes(dc));
}

/**
 * Generate appropriate alt text based on image context
 * @param src - Image source
 * @param context - Image context/usage
 * @param customAlt - Custom alt text if provided
 */
export function generateAltText(
  src: string,
  context: string = "",
  customAlt?: string
): string {
  if (customAlt) {
    return sanitizeAltText(customAlt);
  }

  if (isDecorativeImage(context)) {
    return "";
  }

  // Extract filename from src as fallback
  const filename = src.split("/").pop()?.split(".")[0] || "image";
  return sanitizeAltText(filename.replace(/[-_]/g, " "));
}

/**
 * Get optimal image quality based on device
 * @returns Quality value (0-100)
 */
export function getOptimalQuality(): number {
  if (typeof window === "undefined") return 75;
  
  const connection = (navigator as Navigator & { connection?: { saveData: boolean; effectiveType: string } }).connection;
  if (connection) {
    if (connection.saveData) return 60;
    if (connection.effectiveType === "4g") return 85;
    if (connection.effectiveType === "3g") return 70;
    if (connection.effectiveType === "2g") return 60;
  }
  
  return 75;
}

/**
 * Calculate aspect ratio from dimensions
 * @param width - Image width
 * @param height - Image height
 */
export function getAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Get image dimensions from URL (if available in filename)
 * @param url - Image URL
 */
export function parseImageDimensions(url: string): { width?: number; height?: number } | null {
  const match = url.match(/(\d+)x(\d+)/);
  if (match) {
    return { width: parseInt(match[1]), height: parseInt(match[2]) };
  }
  return null;
}
