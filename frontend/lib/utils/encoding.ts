/**
 * UTF-8 Encoding utilities for Vietnamese text
 * Ensures proper display of Vietnamese characters
 */

/**
 * Normalize Vietnamese text to ensure proper encoding
 * Converts to NFC (Canonical Decomposition, followed by Canonical Composition)
 */
export function normalizeVietnameseText(text: string): string {
  return text.normalize("NFC");
}

/**
 * Validate if text contains Vietnamese characters
 */
export function hasVietnameseChars(text: string): boolean {
  const vietnameseRegex =
    /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]/;
  return vietnameseRegex.test(text);
}

/**
 * Escape special characters for JSON-LD schema
 */
export function escapeForSchema(text: string): string {
  return normalizeVietnameseText(text)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Convert Vietnamese text to URL-safe slug
 */
export function vietnameseToSlug(text: string): string {
  const map: Record<string, string> = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
    Đ: "d",
  };

  let slug = text.toLowerCase();

  // Replace Vietnamese characters
  for (const [key, value] of Object.entries(map)) {
    slug = slug.replace(new RegExp(key, "g"), value);
  }

  // Replace non-alphanumeric with hyphens
  slug = slug.replace(/[^a-z0-9]+/g, "-");

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
}

/**
 * Format Vietnamese currency
 */
export function formatVietnameseCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format Vietnamese date
 */
export function formatVietnameseDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}
