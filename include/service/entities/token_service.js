module.exports = (pb) => {
    class TokenService {
        constructor (context) {
            this.site = context.site;
            this.user = context.user;
            this.queryService = new pb.SiteQueryService({site: this.site, onlyThisSite: true});
        }

        async generateUserToken () {
            let token = pb.util.uniqueId();
            let tokenInfo = {
                token: token,
                user: this.user,
                used: false,
                site: this.site
            };

            await this._saveToken(tokenInfo);
            return {token};
        }

        async validateUserToken (token) {
            this.queryService.onlyThisSite = true;
            let tokenInfo = await this.queryService.loadByValueAsync('token', token, 'auth_token');
            if (!tokenInfo || tokenInfo.used) {
                throw new pb.Errors.notFound('token not found or token has already been used');
            }
            token.used = true;
            let result = await this._saveToken(tokenInfo);

            let timeDiff = Date.now() - tokenInfo.created;
            return {
                tokenInfo: result,
                valid: timeDiff < 300000
            };
        }
        _saveToken (tokenInfo) {
            let doc = pb.DAO.create('auth_token', tokenInfo);
            this.queryService.onlyThisSite = false; // TODO: Evaluate if we want this way, it looked like a bug in the original
            return this.queryService.saveAsync(doc);
        }
    }
    //exports
    return TokenService;
};
