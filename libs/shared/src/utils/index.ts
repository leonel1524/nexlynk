import { VALIDATION } from '../constants';

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate a business slug
 */
export function isValidSlug(slug: string): boolean {
  return (
    VALIDATION.slug_pattern.test(slug) &&
    slug.length >= VALIDATION.slug_min_length &&
    slug.length <= VALIDATION.slug_max_length
  );
}

/**
 * Format price to USD currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Format phone number for WhatsApp link
 */
export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Generate WhatsApp message URL
 */
export function generateWhatsAppUrl(
  phone: string,
  message: string
): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Generate Google Maps URL from coordinates
 */
export function generateGoogleMapsUrl(
  latitude?: number,
  longitude?: number,
  address?: string
): string {
  if (latitude && longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
  return 'https://www.google.com/maps';
}

/**
 * Generate order message for WhatsApp
 */
export function generateOrderMessage(
  businessName: string,
  items: Array<{ name: string; quantity: number; price?: number }>
): string {
  const itemList = items
    .map((item) => {
      const priceStr = item.price ? ` ($${item.price})` : '';
      return `- ${item.quantity}x ${item.name}${priceStr}`;
    })
    .join('\n');

  const total = items.reduce((sum, item) => {
    return sum + (item.price ? item.price * item.quantity : 0);
  }, 0);

  const totalStr = total > 0 ? `\n\nTotal: $${total}` : '';

  return `¡Hola! Me gustaría hacer el siguiente pedido:\n\n${itemList}${totalStr}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get time ago string from date
 */
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'año'],
    [2592000, 'mes'],
    [604800, 'semana'],
    [86400, 'día'],
    [3600, 'hora'],
    [60, 'minuto'],
    [1, 'segundo'],
  ];

  for (const [secondsInInterval, label] of intervals) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `hace ${interval} ${label}${interval > 1 ? 's' : ''}`;
    }
  }

  return 'ahora';
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
