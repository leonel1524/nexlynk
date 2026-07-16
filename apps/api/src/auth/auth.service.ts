import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../common/supabase/supabase.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    if (!this.supabaseService.isConfigured) {
      // Mock mode for development
      return this.mockLogin(email);
    }

    // Authenticate with Supabase
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Ensure user profile exists in public.users (upsert in case trigger didn't fire)
    console.log(`📝 Upserting user profile for: ${data.user.id}`);
    const { data: upsertResult, error: upsertError } = await this.supabaseService.client
      .from('users')
      .upsert(
        { id: data.user.id, email: data.user.email!, name: data.user.user_metadata?.name || null },
        { onConflict: 'id' }
      )
      .select();

    if (upsertError) {
      console.error('⚠️ Upsert user profile failed (non-blocking):', JSON.stringify(upsertError));
    } else {
      console.log('✅ User profile upserted:', upsertResult);
    }

    // Get user profile (may not exist if upsert failed)
    const { data: profile } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Generate JWT
    const token = this.generateToken(data.user.id, data.user.email!);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name,
        plan: profile?.plan || 'free',
      },
      tokens: {
        access_token: token,
        expires_in: 3600,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, businessName } = registerDto;

    if (!this.supabaseService.isConfigured) {
      // Mock mode for development
      return this.mockRegister(email, name, businessName);
    }

    // Register with Supabase Auth
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ConflictException('El correo ya está registrado');
      }
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Error al crear el usuario');
    }

    // User profile is auto-created by the trigger on auth.users
    // No need to insert into public.users manually

    // Create business if name provided
    if (businessName) {
      const slug = this.generateSlug(businessName);
      await this.supabaseService.client
        .from('businesses')
        .insert({
          owner_id: data.user.id,
          name: businessName,
          slug,
          is_active: true,
          plan: 'free',
        });
    }

    // Generate JWT
    const token = this.generateToken(data.user.id, email);

    return {
      user: {
        id: data.user.id,
        email,
        name,
        plan: 'free',
      },
      tokens: {
        access_token: token,
        expires_in: 3600,
      },
    };
  }

  async getProfile(userId: string) {
    if (!this.supabaseService.isConfigured) {
      return { id: userId, email: 'mock@example.com', name: 'Mock User', plan: 'free' };
    }

    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return data;
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'nexlynk-secret';
    
    return this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '1h',
    });
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Mock methods for development without Supabase
  private mockLogin(email: string): AuthResponseDto {
    const token = this.generateToken('mock-user-id', email);
    return {
      user: {
        id: 'mock-user-id',
        email,
        name: 'Usuario de Prueba',
        plan: 'free',
      },
      tokens: {
        access_token: token,
        expires_in: 3600,
      },
    };
  }

  private mockRegister(email: string, name: string, businessName?: string): AuthResponseDto {
    const token = this.generateToken('mock-user-id', email);
    return {
      user: {
        id: 'mock-user-id',
        email,
        name,
        plan: 'free',
      },
      tokens: {
        access_token: token,
        expires_in: 3600,
      },
    };
  }
}
