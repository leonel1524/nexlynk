import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET no está configurado');
    }
    
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
    const { data: user, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', sub)
      .single();

    if (error || !user) {
      // User not in public.users - return JWT payload directly
      // This avoids 401 when the trigger or upsert failed
      return { id: sub, email };
    }

    return user;
  }
}
