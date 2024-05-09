import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './video.model';
import mongoose, { Model } from 'mongoose';
import { AgeRestriction } from 'src/utils/enums';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/utils/types';
import { IdDto } from 'src/utils/common.dto';
import { AddRatingDto, GetVideoDto } from './dto/video.dto';
import errorMessages from '../errorMessages';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name)
    private readonly videoModel: Model<Video>,
    @Inject(REQUEST) private readonly request: UserRequest,
    private readonly configService: ConfigService,
  ) {}

  async playVideo(param: IdDto) {
    const video = await this.videoModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(param.id.toString()),
        },
      },
    ]);
    const minimumAge = this.getMinimumAge(video[0].ageRestriction);
    if (this.request.user.userAge > minimumAge) {
      return video[0].videoUrl;
    } else {
      throw new ForbiddenException(errorMessages.notOldEnough);
    }
  }
  async getVideos(query: GetVideoDto) {
    let pipeline = [];

    if (query.title) {
      pipeline.push({
        $match: { title: { $regex: query.title, $options: 'i' } },
      });
    }
    if (query.sort == this.configService.get<string>('sortByRating')) {
      pipeline.push({ $sort: { averageRating: -1 } });
    }

    pipeline.push({
      $project: {
        _id: 0,
        title: 1,
        description: 1,
        duration: 1,
        ageRestriction: 1,
        averageRating: 1,
      },
    });

    return this.videoModel.aggregate(pipeline);
  }

  async addRating(param: IdDto, reqBody: AddRatingDto) {
    const video = await this.videoModel.findById(param.id);
    const { newAverageRating, newRatingsCount } = this.calculateAverageRating(
      video.averageRating,
      video.ratingsCount,
      reqBody.rating,
    );
    await this.videoModel.updateOne(
      { _id: param.id },
      {
        $set: {
          averageRating: newAverageRating,
          ratingsCount: newRatingsCount,
        },
      },
    );
  }
  getMinimumAge(ageRestriction: string) {
    switch (ageRestriction) {
      case AgeRestriction.G:
        return 0;
      case AgeRestriction.PG13:
        return 13;
      case AgeRestriction.PG16:
        return 16;
      case AgeRestriction.PG18:
        return 18;
    }
  }
  calculateAverageRating(
    averageRating: number,
    ratingsCount: number,
    rating: number,
  ) {
    const currentTotalRating = averageRating * ratingsCount;
    const newTotalRating = currentTotalRating + rating;
    const newRatingsCount = ratingsCount + 1;
    const newAverageRating = newTotalRating / newRatingsCount;
    return {
      newAverageRating: newAverageRating,
      newRatingsCount: newRatingsCount,
    };
  }
}
