const RegExpUtils = require('../../utils/reg_exp_utils');

module.exports = (pb) => {

    class UsernamePasswordAuthentication {
        authenticate (credentials) {
            if (!pb.util.isObject(credentials) || !pb.util.isString(credentials.username) || !pb.util.isString(credentials.password)) {
                let message = `UsernamePasswordAuthentication: The username and password must be passed as part of the credentials object: ${credentials}`;
                throw new pb.Errors.badRequest({message});
            }

            let query = this._getQuery(credentials);
            let dao = this._getDAO(credentials);

            return dao.loadByValuesAsync(query, 'user');
        }

        _getDAO (credentials) {
            if (credentials.site) {
                return new pb.SiteQueryService({site: credentials.site, onlyThisSite: false});
            } else {
                return new pb.DAO();
            }
        }
        _getQuery (credentials) {
            let usernameSearchExp = RegExpUtils.getCaseInsensitiveExact(credentials.username);
            let query = {
                object_type : 'user',
                '$or' : [
                    {
                        username : usernameSearchExp
                    },
                    {
                        email : usernameSearchExp
                    }
                ],
                password : credentials.password
            };
            if (!isNaN(credentials.access_level)) {
                query.admin = {
                    '$gte': credentials.access_level
                };
            }
        }
    }

    return UsernamePasswordAuthentication;
};
