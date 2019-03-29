'use strict';

const Promise = require('bluebird');
const Cookies = require('cookies');
const request = require('request-promise');

module.exports = function LogOutSFSSOControllerModule(pb) {
    /**
     * Logs out a user via Salesforce
     * @class LogOutSFActionControllerModule
     * @constructor
     */

    const SalesforceStrategyService = require('../../../services/salesforce/salesforce_strategy_service')(pb);
    class LogOutSFSSOController extends pb.BaseController {
        render(cb) {
            this.sanitizeObject(this.body);
            this.salesforceLogout(cb);
        }

        async salesforceLogout(cb) {
            const salesforceStrategyService = new SalesforceStrategyService();
            let response = await salesforceStrategyService.logout(this.req);
            if (response) {
                try {
                    await new Promise((resolve, reject) => {
                        pb.session.end(this.session, (err, result) => {
                            if (err) {
                                reject(false);
                            } else {
                                //clear the cookie
                                const cookies = new Cookies(this.req, this.res);
                                const cookie = pb.SessionHandler.getSessionCookie(this.session);
                                cookie.expires = new Date();
                                cookie.overwrite = true;
                                cookies.set(pb.SessionHandler.COOKIE_NAME, null, cookie);
                                resolve(true);
                            }
                        });
                    });
                } catch (e) {
                    pb.log.error('Something went wrong during the removal of the cookie : ', e);
                }
            }
            if (response && response.enableCustomLogout && response.url) {
                request({
                    url: response.url,
                    method: 'GET'
                }).pipe(this.res);

            } else {
                this.redirect('/', cb);
            }
        }
    }

    return LogOutSFSSOController;
};