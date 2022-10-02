import { IsString, IsNumber, } from "class-validator";
import { Expose } from 'class-transformer';

class CreateTaskDto{

    @IsString()
    public name!: String;

    @IsString()
    public owner!: String;
    
    @IsNumber()
    public id!: Number;

    @IsString()
    public InitialDate!: String;

    @IsString()
    public finalDate!: String;

    @IsString()
    public status!: String;

    @IsString()
    public description!: String;

    @Expose({name: "taskId"})
    getTaskId(){
        return this.id;
    }

    @Expose({name: "taskName" })
    getTaskName(){
        return this.name;
    }

}

export default CreateTaskDto;