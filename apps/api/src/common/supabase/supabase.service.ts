import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    console.log('🔍 Supabase initialization:');
    console.log(`   SUPABASE_URL: ${supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'NOT SET'}`);

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase credentials not configured. Using mock mode.');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get isConfigured(): boolean {
    return !!this.supabase;
  }
}
