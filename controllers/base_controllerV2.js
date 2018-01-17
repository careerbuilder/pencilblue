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
var url  = require('url');
var util = require('../include/util.js');
if(process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME){
    var newrelic = require('newrelic');
}


module.exports = function BaseControllerModule(pb) {

    // pb dependancies
    var SiteService = pb.SiteService;
    /**
     * The snippet of JS code that will ensure that a form is refilled with values
     * from the post
     */
    const FORM_REFILL_PATTERN = 'if(typeof refillForm !== "undefined") {' + "\n" +
        '$(document).ready(function(){'+ "\n" +
        'refillForm(%s)});}';
    const ALERT_PATTERN = '<div class="alert %s error_success">%s<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>';

    const ENCODING_MAPPING = Object.freeze({
        'UTF-8': 'utf8',
        'US-ASCII': 'ascii',
        'UTF-16LE': 'utf16le'
    });


    class BaseController {
        init (context) {
            // Things related to the request/response
            this.reqHandler = context.reqHandler;
            this.req = context.request;
            this.res = context.response;
            this.session = context.session;

            this.localizationService = context.localization_service;             // @deprecated
            this.ls = context.localization_service;

            // Inbound Data
            this.body = context.body;
            this.pathVars = context.pathVars;
            this.query = context.query;

            // Site Data
            this.pageName            = '';
            this.siteObj             = context.siteObj || {hostname:pb.config.siteRoot};
            this.site                = context.site; // TODO: Or Global
            this.siteName            = context.siteName;
            this.activeTheme         = context.activeTheme;
            this.hostname            = SiteService.getHostWithProtocol(self.siteObj.hostname) || pb.config.siteRoot;
            this.referer             = this.req.headers.referer;

            this.ts = this.getTemplateServiceInstance(context, true);

            this.context = this.getServiceContext();
            this._setupNewRelic();
            this.initSync(context);
        }

        initSync (context) {

        }

        _setupNewRelic () {
            if(process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME) {
                newrelic.addCustomParameter('hostname', this.hostname);
                newrelic.addCustomParameter('pathVars', JSON.stringify(this.pathVars));
                newrelic.addCustomParameter('query', JSON.stringify(this.query));
                newrelic.addCustomParameter('referer', this.referer);
                newrelic.addCustomParameter('x-forwarded-for', this.req.headers["x-forwarded-for"]);
            }
        }

        getServiceContext() {
            return {
                req: this.req,
                session: this.session,
                ls: this.ls,
                ts: this.ts,
                site: this.site,
                hostname: this.hostname,
                activeTheme: this.activeTheme,
                onlyThisSite: true,
                siteObj: this.siteObj
            };
        }

        // TODO: break out to Template Service
        getTemplateServiceInstance (context, shouldPreload) {
            let tsOptions = {
                activeTheme: this.activeTheme,
                ls: this.ls,
                site: this.site
            };

            let ts = new pb.TemplateService(tsOptions);
            if (shouldPreload) {
                ts.registerModel(this._getBaseTemplateModel(context));
            }
            return ts;
        }
        _getBaseTemplateModel (context) {
            return {
                meta_lang: this.ls.language,
                error_success: (flag, cb) => this._displayErrorOrSuccessCallback(flag, cb),
                page_name: (flag, cb) => cb(null, this.pageName),

                localization_script: new pb.TemplateValue(pb.ClientJs.includeJS('/api/localization/script'), false),
                analytics: (flag, cb) => pb.AnalyticsManager.onPageRender(this.req, this.session, this.ls, cb),
                wysiwyg: (flag, cb) => {
                    let wysiwygId = pb.util.uniqueId();

                    this.ts.registerLocal('wys_id', wysiwygId);
                    this.ts.load('admin/elements/wysiwyg', function(err, data) { // TODO: uuhhh
                        cb(err, new pb.TemplateValue(data, false));
                    });
                },
                site_root: this.hostname,
                site_name: this.siteName,
                localized_alternate: (flag, cb) => this.onLocalizedAlternateFlagFound(context.routeLocalized, cb)
            };
        }

        formError (message, redirectLocation, cb) {
            this.session.error = message;
            let uri = pb.UrlService.createSystemUrl(redirectLocation, {hostname: this.hostname});
            if (cb) {
                return cb(pb.RequestHandler.generateRedirect(uri));
            }
            return pb.RequestHandler.generateRedirect(uri);
        };

        _displayErrorOrSuccessCallback (flag, cb) {
            if(!this.session.error && !this.session.success) {
                cb(null, '');
            }
            let classType = this.session.error ? 'alert-danger' : 'alert-success';
            let message = this.session.error || this.session.success;
            delete this.session.error;
            delete this.session.success;

            cb(null, new pb.TemplateValue(
                `<div class="alert ${classType} error_success">${message}
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
             </div>`, false));
        };

        get pageName () {
            return this._pageName;
        }
        set pageName (name) {
            this._pageName = name;
        }

        get sanitizationRules () {
            return {};
        }

        static apiResponse (code, message, data = null) {
            if(!message) {
                message = code === BaseController.API_SUCCESS ? 'SUCCESS' : 'FAILURE';
            }
            return JSON.stringify({code, message, data});
        }



        /**
         * The sanitization rules that apply to Pages and Articles
         * @deprecated Since 0.4.1
         * @static
         * @method getContentSanitizationRules
         */
        BaseController.getContentSanitizationRules = function() {
            return pb.BaseObjectService.getContentSanitizationRules();
        };

        /**
         * @deprecated Since 0.4.1
         * @static
         * @method getDefaultSanitizationRules
         */
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
        static sanitize (value, config) {
            return pb.BaseObjectService.sanitize(value, config);
        };

        /**
         * Redirects a request to a different location
         * @method redirect
         * @param {String} location
         * @param {Function} cb
         */
        redirect (location, cb){
            cb(pb.RequestHandler.generateRedirect(location));
        };
    }

    //constants
    BaseController.API_SUCCESS = 0;
    BaseController.API_FAILURE = 1;

    /**
     * @method onLocalizedAlternateFlagFound
     * @param {Boolean} routeLocalized
     * @param {Function} cb
     */
    BaseController.prototype.onLocalizedAlternateFlagFound = function(routeLocalized, cb) {
        if (!routeLocalized) {
            return cb(null, '');
        }

        var val = '';
        var self = this;
        Object.keys(this.siteObj.supportedLocales).forEach(function(locale) {
            var path = self.req.url;
            var isLocalizedPath = !!self.pathVars.locale && path.indexOf(self.pathVars.locale) >= 0;
            if (self.ls.language === locale && !isLocalizedPath) {
                //skip current language.  We don't need to list it as an alternate
                return;
            }
            var relationship = self.ls.language === locale ? 'canonical' : 'alternate';

            var urlOpts = {
                hostname: self.hostname,
                locale: undefined
            };
            if (self.ls.language === locale) {
                path = path.replace(locale + '/', '').replace(locale, '');
            }
            else if (isLocalizedPath) {
                path = path.replace(self.pathVars.locale, locale);
            }
            else {
                urlOpts.locale = locale;
            }
            var url = pb.UrlService.createSystemUrl(path, urlOpts);
            val += '<link rel="' + relationship + '" hreflang="' + locale + '" href="' + url + '" />\n';
        });
        cb(null, new pb.TemplateValue(val, false));
    };

    /**
     *
     * @method getPostParams
     * @param {Function} cb
     */
    BaseController.prototype.getPostParams = function(cb) {
        var self = this;

        this.getPostData(function(err, raw){
            //Handle error
            if (util.isError(err)) {
                pb.log.error("BaseController.getPostParams encountered an error. ERROR[%s]", err.stack);
                return cb(err, null);
            }

            //lookup encoding
            var encoding = pb.BaseBodyParser.getContentEncoding(self.req);
            encoding = ENCODING_MAPPING[encoding] ? ENCODING_MAPPING[encoding] : 'utf8';

            //convert to string
            var postParams = url.parse('?' + raw.toString(encoding), true).query;

            //In Node v6 a breaking change was introduced into the "querystring" module to prevent reserved words from
            // being passed in as query string parameters and overriding prototype functions.
            // This fix allows for users to continue on with V6 until another viable option comes along
            postParams.hawOwnProperty = Object.prototype.hasOwnProperty;

            cb(null, postParams);
        });
    };

    /**
     * Parses the incoming payload of a request as JSON formatted data.
     * @deprecated Since 0.8.0.  Will be removed in v1.0
     * @method getJSONPostParams
     * @param {Function} cb
     */
    BaseController.prototype.getJSONPostParams = function(cb) {
        var self = this;

        this.getPostData(function(err, raw){
            //Handle error
            if (util.isError(err)) {
                pb.log.error("BaseController.getJSONPostParams encountered an error. ERROR[%s]", err.stack);
                return cb(err, null);
            }

            //lookup encoding
            var encoding = pb.BaseBodyParser.getContentEncoding(self.req);
            encoding = ENCODING_MAPPING[encoding] ? ENCODING_MAPPING[encoding] : 'utf8';

            var error      = null;
            var postParams = null;
            try {
                postParams = JSON.parse(raw.toString(encoding));
            }
            catch(err) {
                error = err;
            }
            cb(error, postParams);
        });
    };

    /**
     *
     * @method getPostData
     * @param {Function} cb
     */
    BaseController.prototype.getPostData = function(cb) {
        var buffers     = [];
        var totalLength = 0;

        this.req.on('data', function (data) {
            buffers.push(data);
            totalLength += data.length;

            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (totalLength > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                var err = new Error("POST limit reached! Maximum of 1MB.");
                err.code = 400;
                cb(err, null);
            }
        });
        this.req.on('end', function () {

            //create one big buffer.
            var body = Buffer.concat (buffers, totalLength);
            cb(null, body);
        });
    };

    /**
     *
     * @method hasRequiredParams
     * @param {Object} queryObject
     * @param {Array} requiredParameters
     */
    BaseController.prototype.hasRequiredParams = function(queryObject, requiredParameters) {

        for (var i = 0; i < requiredParameters.length; i++) {

            if (typeof queryObject[requiredParameters[i]] === 'undefined' || queryObject[requiredParameters[i]].length === 0) {
                return this.ls.g('generic.FORM_INCOMPLETE');
            }
        }

        if(queryObject.password && queryObject.confirm_password) {
            if(queryObject.password !== queryObject.confirm_password) {
                return this.ls.g('users.PASSWORD_MISMATCH');
            }
        }

        return null;
    };

    /**
     *
     * @method setFormFieldValues
     * @param {Object} post
     */
    BaseController.prototype.setFormFieldValues = function(post) {
        this.session.fieldValues = post;
        return this.session;
    };

    /**
     *
     * @method checkForFormRefill
     * @param {String} result
     * @param {Function} cb
     */
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
     * Sanitizes an object.  This function is handy for incoming post objects.  It
     * iterates over each field.  If the field is a string value it will be
     * sanitized based on the default sanitization rules
     * (BaseController.getDefaultSanitizationRules) or those provided by the call
     * to BaseController.getSanitizationRules.
     * @method sanitizeObject
     * @param {Object} obj
     */
    BaseController.prototype.sanitizeObject = function(obj) {
        if (!util.isObject(obj)) {
            pb.log.warn("BaseController.sanitizeObject was not passed an object.");
            return;
        }

        var rules = this.getSanitizationRules();
        Object.keys(obj).forEach(function(prop) {
            if (util.isString(obj[prop])) {

                var config = rules[prop];
                obj[prop] = pb.BaseObjectService.sanitize(obj[prop], config);
            }
        });
    };

    /**
     *
     * @method getSanitizationRules
     * @return {Object}
     */
    BaseController.prototype.getSanitizationRules = function() {
        return {};
    };

    /**
     * The sanitization rules that apply to Pages and Articles
     * @deprecated Since 0.4.1
     * @static
     * @method getContentSanitizationRules
     */
    BaseController.getContentSanitizationRules = function() {
        return pb.BaseObjectService.getContentSanitizationRules();
    };

    /**
     * @deprecated Since 0.4.1
     * @static
     * @method getDefaultSanitizationRules
     */
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
    BaseController.sanitize = function(value, config) {
        return pb.BaseObjectService.sanitize(value, config);
    };

    /**
     * Redirects a request to a different location
     * @method redirect
     * @param {String} location
     * @param {Function} cb
     */
    BaseController.prototype.redirect = function(location, cb){
        cb(pb.RequestHandler.generateRedirect(location));
    };


    return BaseController;
};
