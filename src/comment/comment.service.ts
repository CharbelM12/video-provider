import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommentDto, ReplyDto } from './dto/comment.dto';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/utils/types';
import { IdDto } from 'src/utils/common.dto';
import { Comment } from './comment.model';
import errorMessages from 'src/errorMessages';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}
  async addComment(comment: CommentDto, query: IdDto) {
    await new this.commentModel({
      userId: this.request.user.userId,
      videoId: query.id,
      text: comment.text,
    }).save();
  }

  async updateComment(param: IdDto, comment: CommentDto) {
    await this.validateCommentUser(this.request.user.userId);
    await this.commentModel.updateOne({ _id: param.id }, { $set: comment });
  }
  async addReply(param: IdDto, reply: ReplyDto) {
    await this.commentModel.updateOne(
      { _id: param.id },
      {
        $push: {
          replies: {
            userId: this.request.user.userId,
            text: reply.text,
          },
        },
      },
    );
  }
  async getComments(query: IdDto) {
    return this.commentModel.aggregate([
      {
        $match: {
          videoId: new mongoose.Types.ObjectId(query.id.toString()),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }
  private async validateCommentUser(userId: mongoose.Schema.Types.ObjectId) {
    const comment = await this.commentModel.findOne({ userId: userId });
    if (!comment) {
      throw new ForbiddenException(errorMessages.cannotUpdateComment);
    }
  }
}
