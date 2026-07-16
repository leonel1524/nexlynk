import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private supabaseAnon: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    console.log('🔍 Supabase initialization:');
    console.log(`   SUPABASE_URL: ${supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? serviceKey.substring(0, 10) + '...' : 'NOT SET'}`);
    console.log(`   SUPABASE_ANON_KEY: ${anonKey ? anonKey.substring(0, 10) + '...' : 'NOT SET'}`);

    if (!supabaseUrl || !serviceKey) {
      console.warn('⚠️ Supabase credentials not configured. Using mock mode.');
      return;
    }

    // service_role client — bypasses RLS, for DB operations
    this.supabase = createClient(supabaseUrl, serviceKey);

    // anon client — respects RLS, required for auth endpoints (signUp, signIn)
    this.supabaseAnon = createClient(supabaseUrl, anonKey || serviceKey);

    console.log('✅ Supabase clients created successfully');
  }

  /** DB client (service_role) — bypasses RLS */
  get client(): SupabaseClient {
    return this.supabase;
  }

  /** Auth client (anon) — for signUp, signInWithPassword, etc. */
  get authClient(): SupabaseClient {
    return this.supabaseAnon;
  }

  get isConfigured(): boolean {
    return !!this.supabase;
  }
}
