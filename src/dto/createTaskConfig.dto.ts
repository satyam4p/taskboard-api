import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class config{
    entityType!: string
    entityKey!: string
    label!: string
    visible!: string
    icon!: string
}

class CreateTaskConfigDTO{

    // @Type(()=> config)
    @ValidateNested()
    public name!:config

    // @Type(()=> config)
    @ValidateNested()
    public status!:config

    // @Type(()=> config)
    @ValidateNested()
    public label!:config

    // @Type(()=> config)
    @ValidateNested()
    public description!:config

    // @Type(()=> config)
    @ValidateNested()
    public assignee!:config

}

export default CreateTaskConfigDTO