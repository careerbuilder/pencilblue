function _getDao(loginContext, pb) {
    if (loginContext.site) {
        return new pb.SiteQueryService({
            site: loginContext.site,
            onlyThisSite: false
        });
    } else {
        return new pb.DAO();
    }
};

function _addUserToSession(req, user, pb) {
    delete user.password;

    //build out session object
    user.permissions = pb.PluginService.getPermissionsForRole(user.admin);
    req.session.authentication.user = user || {};
    req.session.authentication.user_id = user[pb.DAO.getIdField()] ? user[pb.DAO.getIdField()].toString() : null;
    req.session.authentication.admin_level = user.admin;

    //set locale if no preference already indicated for the session
    if (!req.session.locale) {
        req.session.locale = user.locale;
    }

    delete req.session._loginContext; // Remove login context from session now its used
};

function _getQuery(loginContext, identityProvider, pb, ignorePassword) {
    const usernameSearchExp = pb.regexUtil.getCaseInsensitiveExact(loginContext.username);
    let query = {
        object_type: 'user',
        identity_provider: identityProvider
    };
    if (identityProvider) {
        query.external_user_id = loginContext.externalUserId;
    } else {
        query['$or'] = [{
            username: usernameSearchExp
        }, {
            email: usernameSearchExp
        }];
    }
    if (!ignorePassword) {
        query.password = pb.security.encrypt(loginContext.password);
    }
    //check for required access level
    if (!isNaN(loginContext.access_level)) {
        query.admin = {
            '$gte': loginContext.access_level
        };
    }
    return query;
};

async function getUser(loginContext, identityProvider, done, pb, ignorePassword = false) {
    //search for user
    let user;
    let query = _getQuery(loginContext, identityProvider, pb, ignorePassword);
    const dao = _getDao(loginContext, pb);
    try {
        user = await dao.loadByValuesAsync(query, 'user');
    } catch (err) {
        pb.log.error(`Failed to get user during authentication. ${err}`);
        return done(null, false);
    }
    return user;
}

async function saveUser(user, loginContext, done, pb, ignorePassword = false) {
    let createdUser;
    const dao = _getDao(loginContext, pb);
    try {
        let _loginContext = {
            site: loginContext.site,
            username: user.username,
            externalUserId: user.external_user_id
        };
        createdUser = await getUser(_loginContext, user.identity_provider, done, pb, true);
        if (!createdUser) {
            await dao.saveAsync(user);
            createdUser = await getUser(_loginContext, user.identity_provider, done, pb, true);
        } else if (createdUser && createdUser.email !== user.email) {
            await dao.updateFieldsAsync('user', {
                object_type: 'user',
                external_user_id: user.external_user_id
            }, {
                '$set': {
                    email: user.email
                }
            });
        }
    } catch (err) {
        pb.log.error(`Failed to get createdUser during authentication. ${err}`);
        return done(null, false);
    }
    return createdUser;
}

module.exports = {
    _getDao,
    _getQuery,
    _addUserToSession,
    getUser,
    saveUser
};