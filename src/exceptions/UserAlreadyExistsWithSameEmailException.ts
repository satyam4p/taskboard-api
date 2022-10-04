import HttpException from "./HttpExceptions";

class UserWithSameEmailAreadyExisitsException extends HttpException{

   constructor(email:string){
        super(400, `User with email ${email} already exisits.`)
    }

}

export default UserWithSameEmailAreadyExisitsException;