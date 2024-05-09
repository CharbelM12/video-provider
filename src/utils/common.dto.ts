import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class IdDto {
  @IsMongoId()
  id: mongoose.Schema.Types.ObjectId;
}
