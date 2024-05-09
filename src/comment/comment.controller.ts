import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto, ReplyDto } from './dto/comment.dto';
import { IdDto } from 'src/utils/common.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  addComment(@Body() comment: CommentDto, @Query() query: IdDto) {
    return this.commentService.addComment(comment, query);
  }

  @Put(':id')
  updateComment(@Param() param: IdDto, @Body() comment: CommentDto) {
    return this.commentService.updateComment(param, comment);
  }
  @Put('/reply/:id')
  addReply(@Param() param: IdDto, @Body() reply: ReplyDto) {
    return this.commentService.addReply(param, reply);
  }
  @Get()
  getComments(@Query() query: IdDto) {
    return this.commentService.getComments(query);
  }
}
