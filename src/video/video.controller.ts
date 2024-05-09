import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { IdDto } from 'src/utils/common.dto';
import { GetVideoDto, AddRatingDto } from './dto/video.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Public } from 'src/decorators/public.decorator';

@UseGuards(AuthenticationGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('play/:id')
  playVideo(@Param() param: IdDto) {
    return this.videoService.playVideo(param);
  }

  @Public()
  @Get()
  getVideos(@Query() query: GetVideoDto) {
    return this.videoService.getVideos(query);
  }

  @Put('rating/:id')
  addRating(@Param() param: IdDto, @Body() reqBody: AddRatingDto) {
    return this.videoService.addRating(param, reqBody);
  }
}
