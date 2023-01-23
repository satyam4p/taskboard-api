import { IsString, IsNumber, ValidateNested, IsNotEmptyObject,  } from "class-validator";
import { Expose } from 'class-transformer';

interface user{
    user: {
        username: string,
        userId: string
    };
}

class createComment{

    @IsString()
    public body!: String

    @ValidateNested()
    @IsNotEmptyObject()
    public user!: user
}

export default createComment;