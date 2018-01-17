module.exports = function ForgotPasswordControllerModule(pb) {
    class ForgotPasswordController extends pb.BaseController {
        promisedInit () {
            this.userService = new pb.UserService(this.getServiceContext());
            this.passwordResetService = new pb.PasswordResetService(this.getServiceContext());
        }
        render () {
            let returnUrl = this.query.admin ? '/admin/login' : '/user/login';

            try {
                this.passwordResetService.addIfNotExists(this.body.username); // TODO: Promiseify this service
            } catch (err) {
                let msg = pb.util.isArray(err.validationErrors) ? err.validationErrors[0].message : err.message;

                return this.formError(`${this.ls.g('generic.ERROR_SAVING')}: ${msg}`, returnUrl);
            }
            this.session.success = this.ls.g('users.YOUR_PASSWORD_RESET');
            this.redirect(returnUrl);
        }
        getServiceContext () {
            let context = super.getServiceContext();
            return Object.assign({}, context, {
                userService: this.userService,
                siteService: new pb.SiteService(context),
                emailService: new pb.EmailService(Object.assign({}, context, {onlyThisSite: false}))
            });
        }
    }

    return ForgotPasswordController;
};
