module.exports = (pb) => {
    return {
        UsernamePasswordAuthentication: require('./username_password_authenticator')(pb),
        FormAuthentication: require('./form_authentication')(pb),
        TokenAuthentication: require('./token_authentication')(pb)
    };
};
