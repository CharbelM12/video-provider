import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CommentDocument = mongoose.HydratedDocument<Comment>;

@Schema({ timestamps: true, versionKey: false })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  videoId: mongoose.Schema.Types.ObjectId;

  @Prop()
  text: string;

  @Prop({
    type: [{ userId: mongoose.Schema.Types.ObjectId, text: String }],
    default: [],
  })
  replies: [
    {
      userId: mongoose.Schema.Types.ObjectId;
      text: string;
    },
  ];
}
export const commentSchema = SchemaFactory.createForClass(Comment);
commentSchema.index({ userId: 1 });
commentSchema.index({ videoId: 1 });
