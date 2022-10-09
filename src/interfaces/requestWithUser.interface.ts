import { User } from '../interfaces/user.interface';
import { Request } from 'express';

export default interface RequestWithUser extends Request{
    user: User;
    token: string;
}
