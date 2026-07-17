import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../common/supabase/supabase.service';

@Injectable()
export class UploadService {
  private readonly bucketName = 'business-assets';

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<{ url: string; path: string }> {
    if (!this.supabaseService.isConfigured) {
      // Mock mode: return a placeholder URL
      return {
        url: `https://placeholder.com/${folder}/${file.originalname}`,
        path: `${folder}/${file.originalname}`,
      };
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await this.supabaseService.client.storage
      .from(this.bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('❌ Upload failed:', error.message);
      throw new InternalServerErrorException('Error al subir el archivo');
    }

    const { data: urlData } = this.supabaseService.client.storage
      .from(this.bucketName)
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      path: fileName,
    };
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.supabaseService.isConfigured) {
      return;
    }

    const { error } = await this.supabaseService.client.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      console.error('⚠️ Delete file error (non-blocking):', error.message);
    }
  }
}
