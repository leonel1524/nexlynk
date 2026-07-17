import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../common/supabase/supabase.service';
import { LoginDto, RegisterDto, AuthResponseDto, UpdateProfileDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { generateSlug } from '@nexlynk/shared';

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
      const slug = generateSlug(businessName);
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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!this.supabaseService.isConfigured) {
      return { id: userId, ...dto, message: 'Perfil actualizado (mock)' };
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.website !== undefined) updateData.website = dto.website;

    const { data, error } = await this.supabaseService.client
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Update profile failed:', error.message);
      throw new InternalServerErrorException('Error al actualizar el perfil');
    }

    return data;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (!this.supabaseService.isConfigured) {
      return { message: 'Contraseña actualizada (mock)' };
    }

    // First verify current password by attempting sign-in
    const { data: userData } = await this.supabaseService.client
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!userData?.email) {
      throw new InternalServerErrorException('Usuario no encontrado');
    }

    const { error: signInError } = await this.supabaseService.authClient.auth.signInWithPassword({
      email: userData.email,
      password: dto.currentPassword,
    });

    if (signInError) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const { error } = await this.supabaseService.authClient.auth.updateUser({
      password: dto.newPassword,
    });

    if (error) {
      console.error('❌ Change password failed:', error.message);
      throw new InternalServerErrorException('Error al cambiar la contraseña');
    }

    return { message: 'Contraseña actualizada correctamente' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    if (!this.supabaseService.isConfigured) {
      return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
    }

    const { error } = await this.supabaseService.authClient.auth.resetPasswordForEmail(dto.email, {
      redirectTo: `${this.configService.get<string>('ADMIN_URL', 'http://localhost:4200')}/reset-password`,
    });

    if (error) {
      console.error('⚠️ Forgot password error (non-blocking):', error.message);
    }

    // Always return success to prevent email enumeration
    return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (!this.supabaseService.isConfigured) {
      return { message: 'Contraseña restablecida (mock)' };
    }

    const { error } = await this.supabaseService.authClient.auth.updateUser({
      password: dto.password,
    });

    if (error) {
      console.error('❌ Reset password failed:', error.message);
      throw new BadRequestException('Token inválido o expirado');
    }

    return { message: 'Contraseña restablecida correctamente' };
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
