module.exports = (pb) => {
    const BaseAuthentication = require('./username_password_authenticator')(pb);

    class FormAuthentication extends BaseAuthentication {
        authenticate (post) {
            if (!pb.util.isObject(post)) {
                throw new pb.Errors.badRequest({message:`FormAuthentication: The postObj parameter must be an object: ${post}`});
            }

            post.password = post.password ? pb.SecurityService.encrypt(post.password) : '';
            super.authenticate(post);
        }
    }

    return FormAuthentication;
};
