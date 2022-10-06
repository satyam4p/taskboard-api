import HttpException from "./HttpExceptions";

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing');
  }
}

export default AuthenticationTokenMissingException;