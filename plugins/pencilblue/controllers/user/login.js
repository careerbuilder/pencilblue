module.exports = function LoginViewControllerModule(pb) {

    class UserLoginController extends pb.BaseController {
        async login () {
            if(pb.security.isAuthenticated(this.session)) {
                return this.redirect('/');
            }

            this.setPageName(this.ls.g('generic.LOGIN'));
            return {content: await this.ts.load('user/login')};
        }
    }

    //exports
    return UserLoginController;
};
