import { Module } from '@nestjs/common';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configurations/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    VideoModule,
    CommentModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
