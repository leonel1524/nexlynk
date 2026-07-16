import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || 'nexlynk-secret';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, email } = payload;

    if (!this.supabaseService.isConfigured) {
      // Mock mode - return the payload directly
      return { id: sub, email };
    }

    // Try to find the user in public.users
    let { data: user, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', sub)
      .single();

    // If user not found, create the profile (in case trigger didn't fire)
    if (error || !user) {
      const { error: insertError } = await this.supabaseService.client
        .from('users')
        .upsert(
          { id: sub, email },
          { onConflict: 'id' }
        );

      if (!insertError) {
        const { data: newUser } = await this.supabaseService.client
          .from('users')
          .select('*')
          .eq('id', sub)
          .single();
        user = newUser;
      }
    }

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
}
