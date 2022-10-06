import HttpException from "./HttpExceptions";

export default class WrongAuthenticationTokenException extends HttpException{

    constructor(){
        super(401, 'wrong authentication token');
    }

}