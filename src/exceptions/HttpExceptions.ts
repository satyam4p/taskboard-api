/**
 * defining our own exception handler class with similar format of an error
 */
class HttpException extends Error{

    status:number;
    message:string;
    constructor(status:number, message: string){
        super(message);
        this.message = message;
        this.status = status;
    }
}
export default HttpException;