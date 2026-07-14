import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { MenusModule } from './menus/menus.module';
import { LocationsModule } from './locations/locations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupabaseModule } from './common/supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    BusinessesModule,
    MenusModule,
    LocationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
