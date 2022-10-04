import HttpException from "./HttpExceptions";

class WrongCredentialsExceptioon extends HttpException{

    constructor(){
        super(401, 'Wrong credentials entered');
    }

}

export default WrongCredentialsExceptioon;