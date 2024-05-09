import mongoose from 'mongoose';

export class UserRequest extends Request {
  user: User;
}
interface User {
  userId: mongoose.Schema.Types.ObjectId;
  userAge: number;
}
