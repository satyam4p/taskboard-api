import { IsString } from "class-validator";


class LogInDto{

    @IsString()
    public email!: String;

    @IsString()
    public passwword!: String;

}

export default LogInDto;