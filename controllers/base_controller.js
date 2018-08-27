/*
    Copyright (C) 2016  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

//dependencies
const url  = require('url');
let newrelic = null;
if(process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME){
    newrelic = require('newrelic');
}


module.exports = function BaseControllerModule(pb) {

    // pb dependancies
    const  SiteService = pb.SiteService;

    // TODO: figure out if we need this
    const FORM_REFILL_PATTERN = 'if(typeof refillForm !== "undefined") {' + "\n" +
        '$(document).ready(function(){'+ "\n" +
        'refillForm(%s)});}';

    // TODO: move this somewhere else
    const ALERT_PATTERN = '<div class="alert %s error_success">%s<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>';

    class BaseController{
        async init (ctx) {
            this._ctx = ctx; // This is the Koa ctx object.  Limited use.
            this.req = ctx.req;
            this.res = ctx.res;

            this.session = ctx.session;

            this.body = ctx.req.body || {};     // These are the kv pairs of post/put params, if they exist
            this.pathVars = ctx.params || {};   // These are the kv pairs of path vars if they exist
            this.query = ctx.query || {};       // These are the kv pairs of Query Strings if they exist

            this.ls = ctx.req.localizationService;
            this.locale = this.ls.language || 'en-US';
            this.ls.get = this.ls.g; // TODO: remove this hack once localization service is refactored

            // Site Data
            this.siteObj = ctx.req.siteObj || {hostname: pb.config.siteRoot};
            this.site = ctx.req.site;
            this.siteName = ctx.req.siteName;
            this.hostname = SiteService.getHostWithProtocol(this.siteObj.hostname) || pb.config.siteRoot;
            this.activeTheme = ctx.req.activeTheme || 'pencilblue'; // TODO: Replace with kronos
            this.routeLocalized = !!(ctx.req.route && ctx.req.route.localization);

            if(process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME) {
                this._initNewRelic();
            }
        }

        get sanitizationRules () {
            return {};
        }

        get serviceContext () {
            return Object.assign({},{
                req: this.req,
                session: this.session,
                ls: this.ls,
                ts: this.ts,
                site: this.site,
                hostname: this.hostname,
                activeTheme: this.activeTheme,
                onlyThisSite: true,
                siteObj: this.siteObj
            });
        };

        createService(serviceName, pluginName) {
            if(!pluginName) { // If no plugin name is given, assuming core service
                return new pb[serviceName](this.serviceContext);
            }

            let ServiceClass = pb.PluginService.getService(serviceName, pluginName, this.site);
            return new ServiceClass(this.serviceContext);
        }
        tryCreateService(serviceName, pluginName) {
            let service = null;
            try {
                service = this.createService(serviceName, pluginName);
                return service;
            } catch (err) {
                return service;
            }
        }
        /**
         * @deprecated 1.0.0
         * @returns {*}
         */
        getServiceContext () {
            return this.serviceContext;
        }

        // TODO: Integrate into calling code, not base controller
        hasRequiredParams (queryObject, requiredParameters) {
            let missingRequiredParam = requiredParameters
                .some(requiredParam => !queryObject[requiredParam] || !queryObject[requiredParam].length);
            if(missingRequiredParam) {
                return this.ls.g('generic.FORM_INCOMPLETE');
            }
            let hasPassword = queryObject.password && queryObject.confirm_password;
            let passwordsMatch = queryObject.password === queryObject.confirm_password;

            if (hasPassword && !passwordsMatch) {
                return this.ls.g('users.PASSWORD_MISMATCH');
            }

            return null;
        };

        redirect (location, code = 302){
            this._ctx.status = code;
            this._ctx.redirect(location);
            this._ctx.body = `${code} Redirecting to ${location}`;
        }

        sanitizeObject (obj) {
            if (!pb.util.isObject(obj)) {
                return pb.log.warn("BaseController.sanitizeObject was not passed an object.");
            }

            let rules = this.sanitizationRules;
            Object.keys(obj).forEach((prop) => {
                if (pb.util.isString(obj[prop])) {
                    obj[prop] = pb.BaseObjectService.sanitize(obj[prop], rules[prop]);
                    // TODO: dont use base object service?
                }
            });
        }
        _initNewRelic() {
            newrelic.addCustomParameter('hostname', this.hostname);
            newrelic.addCustomParameter('pathVars', JSON.stringify(this.pathVars));
            newrelic.addCustomParameter('query', JSON.stringify(this.query));
            newrelic.addCustomParameter('referer', this.req.headers.referer);
            newrelic.addCustomParameter('x-forwarded-for', this.req.headers["x-forwarded-for"]);
        }
    }

    //constants
// TODO: move to Api Controller
    BaseController.API_SUCCESS = 0;
// TODO: move to api controller
    BaseController.API_FAILURE = 1;

    /**
     * Creates a TemplateService instance
     * @method getTemplateServiceInstance
     * @param {Object} props
     * @return {TemplateService}
     */
    // TODO: move to base view controller


    /**
     *
     * @method formError
     * @param {String} message The error message to be displayed
     * @param {String} redirectLocation
     * @param {Function} cb
     */
    // TODO: move to view controller
    BaseController.prototype.formError = function(message, redirectLocation, cb) {

        this.session.error = message;
        var uri = pb.UrlService.createSystemUrl(redirectLocation, { hostname: this.hostname });
        cb(pb.RequestHandler.generateRedirect(uri));
    };
    /**
     * Sets the page title
     * @method setPageName
     * @param {String} pageName The desired page title
     */
    // TODO: move to view controller as setter
    BaseController.prototype.setPageName = function(pageName) {
        this.pageName = pageName;
    };


    /**
     *
     * @method checkForFormRefill
     * @param {String} result
     * @param {Function} cb
     */
    // TODO: move to page form and article form
    BaseController.prototype.checkForFormRefill = function(result, cb) {
        if(this.session.fieldValues) {
            var content    = util.format(FORM_REFILL_PATTERN, JSON.stringify(this.session.fieldValues));
            var formScript = pb.ClientJs.getJSTag(content);
            result         = result.concat(formScript);

            delete this.session.fieldValues;
        }

        cb(null, result);
    };


    /**
     * The sanitization rules that apply to Pages and Articles
     * @deprecated Since 0.4.1
     * @static
     * @method getContentSanitizationRules
     */
    // TODO: Replace in calling code?  Or replace Base Object Service
    BaseController.getContentSanitizationRules = function() {
        return pb.BaseObjectService.getContentSanitizationRules();
    };

    /**
     * @deprecated Since 0.4.1
     * @static
     * @method getDefaultSanitizationRules
     */
    // TODO: Replace in calling code?  Or replace Base Object Service
    BaseController.getDefaultSanitizationRules = function() {
        return pb.BaseObjectService.getDefaultSanitizationRules();
    };

    /**
     *
     * @deprecated Since 0.4.1
     * @static
     * @method sanitize
     * @param {String} value
     * @param {Object} [config]
     */
    // TODO: Replace in calling code?  Or replace Base Object Service
    BaseController.sanitize = function(value, config) {
        return pb.BaseObjectService.sanitize(value, config);
    };



    /**
     * Generates an generic API response object
     * @static
     * @method apiResponse
     * @return {String} JSON
     */
    // TODO: move to API Base Controller
    BaseController.apiResponse = function(cd, msg, dta) {
        if(typeof msg === 'undefined') {
            switch(cd) {
                case BaseController.API_FAILURE:
                    msg = 'FAILURE';
                    break;
                case BaseController.API_SUCCESS:
                    msg = 'SUCCESS';
                    break;
                default:
                    msg = '';
                    break;
            }
        }
        if(typeof dta === 'undefined') {
            dta = null;
        }
        var response = {code: cd, message: msg, data: dta};
        return JSON.stringify(response);
    };

    return BaseController;
};
