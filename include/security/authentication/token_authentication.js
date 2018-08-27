module.exports = (pb) => {
    const BaseAuthenticator = require('./username_password_authenticator')(pb);

    class TokenAuthentication extends BaseAuthenticator {
        constructor (context) {
            super(context);
            this.context = context;
            this.tokenService = new pb.TokenService(context);
            this.userService = new pb.UserService(context);
        }
        async authenticate (token) {
            let result = await this.tokenService.validateUserToken(token);

            if(!result.tokenInfo || !result.valid || !result.tokenInfo.user) {
                return;
            }
            this.userService.getAsync(result.tokenInfo.user); // TODO: Promisify this
        }
    }
    return TokenAuthentication;
};
