import { AuthService } from './auth.service';
import { SupabaseService } from '../common/supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(
      { isConfigured: false } as unknown as SupabaseService,
      { sign: jest.fn().mockReturnValue('mock-token') } as unknown as JwtService,
      { get: jest.fn().mockReturnValue('test-secret') } as unknown as ConfigService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSlug (private)', () => {
    it('should generate slug from text', () => {
      const result = (service as any).generateSlug('Mi Negocio');
      expect(result).toBe('mi-negocio');
    });

    it('should handle special characters', () => {
      const result = (service as any).generateSlug('¡Hola! ¿Cómo estás?');
      expect(result).toBe('hola-cmo-ests');
    });

    it('should handle multiple spaces', () => {
      const result = (service as any).generateSlug('  Mi   Negocio  ');
      expect(result).toBe('mi-negocio');
    });
  });

  describe('getProfile', () => {
    it('should return mock profile when Supabase not configured', async () => {
      const result = await service.getProfile('user-id');
      expect(result).toHaveProperty('id', 'user-id');
      expect(result).toHaveProperty('email', 'mock@example.com');
    });
  });
});
