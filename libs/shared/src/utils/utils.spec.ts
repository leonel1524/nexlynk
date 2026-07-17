import { generateSlug, formatPrice, formatWhatsAppNumber, generateWhatsAppUrl, generateGoogleMapsUrl, truncate, getTimeAgo, clamp, isEmpty, debounce } from './index';

describe('Utils', () => {
  describe('generateSlug', () => {
    it('should convert text to slug', () => {
      expect(generateSlug('Mi Negocio')).toBe('mi-negocio');
    });

    it('should handle special characters', () => {
      expect(generateSlug('¡Hola! ¿Cómo estás?')).toBe('hola-cmo-ests');
    });

    it('should handle multiple spaces and underscores', () => {
      expect(generateSlug('  Mi   Negocio  ')).toBe('mi-negocio');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });
  });

  describe('formatPrice', () => {
    it('should format price with USD currency', () => {
      expect(formatPrice(25)).toContain('25');
    });

    it('should format decimal price', () => {
      expect(formatPrice(25.99)).toContain('25.99');
    });
  });

  describe('formatWhatsAppNumber', () => {
    it('should remove non-digit characters', () => {
      expect(formatWhatsAppNumber('+58 412 1234567')).toBe('584121234567');
    });
  });

  describe('generateWhatsAppUrl', () => {
    it('should generate WhatsApp URL with phone and message', () => {
      const url = generateWhatsAppUrl('+58 412 1234567', 'Hola');
      expect(url).toContain('wa.me');
      expect(url).toContain('584121234567');
    });
  });

  describe('generateGoogleMapsUrl', () => {
    it('should generate maps URL with coordinates', () => {
      const url = generateGoogleMapsUrl(10.5, -66.9);
      expect(url).toContain('google.com/maps');
      expect(url).toContain('10.5');
    });

    it('should generate maps URL with address', () => {
      const url = generateGoogleMapsUrl(undefined, undefined, 'Caracas');
      expect(url).toContain('google.com/maps');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Hi', 5)).toBe('Hi');
    });
  });

  describe('clamp', () => {
    it('should clamp value between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null/undefined/empty', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 200);
    });
  });
});
