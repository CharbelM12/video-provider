import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, videoSchema } from './video.model';
import { ConfigModule } from '@nestjs/config';
import videoConfig from './video.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: videoSchema }]),
    ConfigModule.forRoot({ load: [videoConfig] }),
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
