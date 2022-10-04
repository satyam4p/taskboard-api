import { IsString } from 'class-validator'


class UserDto{

    @IsString()
    public username!: String;

    @IsString()
    public password!: String;

    @IsString()
    public email!: String;

}

export default UserDto;