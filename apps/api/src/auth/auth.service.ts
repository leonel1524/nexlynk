import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
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
      return this.mockLogin(email);
    }

    // Auth operations use the ANON client
    const { data, error } = await this.supabaseService.authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // DB operations use the SERVICE_ROLE client (bypasses RLS)
    const { error: upsertError } = await this.supabaseService.client
      .from('users')
      .upsert(
        { id: data.user.id, email: data.user.email!, name: data.user.user_metadata?.name || null },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.error('⚠️ Upsert user profile failed (non-blocking):', JSON.stringify(upsertError));
    }

    const { data: profile } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const token = this.generateToken(data.user.id, data.user.email!);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name,
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
      return this.mockRegister(email, name, businessName);
    }

    // Auth operations use the ANON client
    const { data, error } = await this.supabaseService.authClient.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      console.error('❌ Register failed:', error.message);
      if (error.message.includes('already registered')) {
        throw new ConflictException('El correo ya está registrado');
      }
      throw new InternalServerErrorException(error.message);
    }

    if (!data.user) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }

    // Ensure user exists in public.users (FK for businesses.owner_id depends on it)
    const { error: profileError } = await this.supabaseService.client
      .from('users')
      .upsert(
        { id: data.user.id, email: data.user.email!, name: name || null },
        { onConflict: 'id' }
      );

    if (profileError) {
      console.error('⚠️ Upsert user profile during register failed:', JSON.stringify(profileError));
    }

    // Create business if name provided (DB operation → service_role)
    if (businessName) {
      const slug = this.generateSlug(businessName);
      const { error: bizError } = await this.supabaseService.client
        .from('businesses')
        .insert({
          owner_id: data.user.id,
          name: businessName,
          slug,
          is_active: true,
          plan: 'free',
        });

      if (bizError) {
        console.error('⚠️ Business creation during register failed:', JSON.stringify(bizError));
      }
    }

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

    if (error || !data) {
      return { id: userId, email: null, name: null, plan: 'free' };
    }

    return data;
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET no está configurado');
    }
    
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
