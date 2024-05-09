import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AgeRestriction } from 'src/utils/enums';

export type VideoDocument = mongoose.HydratedDocument<Video>;

@Schema({ timestamps: true, versionKey: false })
export class Video {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  duration: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ enum: AgeRestriction })
  ageRestriction: string;

  @Prop()
  videoUrl: string;

  @Prop({ default: 0 })
  ratingsCount: number;
}
export const videoSchema = SchemaFactory.createForClass(Video);
videoSchema.index({ title: 1 });
videoSchema.index({ averageRating: 1 });
videoSchema.index({ title: 1, averageRating: 1 });
