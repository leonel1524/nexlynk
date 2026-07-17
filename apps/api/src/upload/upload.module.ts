import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { SupabaseModule } from '../common/supabase/supabase.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: undefined, // Use memory storage
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE', 5 * 1024 * 1024), // 5MB default
        },
        fileFilter: (req: any, file: any, cb: any) => {
          if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
            cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'), false);
          } else {
            cb(null, true);
          }
        },
      }),
      inject: [ConfigService],
    }),
    SupabaseModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
