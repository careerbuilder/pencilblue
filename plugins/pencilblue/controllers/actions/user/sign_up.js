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
var async = require('async');

module.exports = function (pb) {

    class SignUpController extends pb.BaseActionController {
        promisedInit () {
            this.sqs = new pb.SiteQueryService({site: this.site, onlyThisSite: false});
            this.contentService = new pb.ContentService({site: this.site});
            this.userService = new pb.UserService(this.getServiceContext());
        }
        async render () {

            let payload = this.payload;

            let message = this.hasRequiredParams(this.payload, this.requiredFields);
            if (message) {
                return this._clientError(message);
            }
            let contentSettings;
            try {
                contentSettings = this.contentService.getSettings();
            } catch (err) {
                pb.log.error("ContentService.getSettings encountered an error. ERROR[%s]", err.stack);
                return this._serverError(err);
            }

            let user = this._createDBO(payload, contentSettings);

            try {
                await Promise.all[this._validateEmail(user), this._validateUserName(user)];
            } catch (err) {
                return this._clientError(errMsg);
            }

            try {
                this.dao.save(user);
                if(contentSettings.require_verification) {
                    await this.service.sendVerificationEmail();
                }
                return this._sendSuccess(this.successMsg);
            } catch (err) {
                return this._serverError(this.ls.g('generic.ERROR_SAVING'));
            }
        }

        async _validateUserName(user) {
            let userNames = await Promise.all([
                this.sqs.count('user', {username: user.username}),
                this.sqs.count('unverified_user', {username: user.username})
            ]);
            if(_.flatten(userNames).length > 0) {
                throw this._getValidationError('users.EXISTING_USERNAME');
            }
        }

        async _validateEmail(user) {
            let emails = await Promise.all([
                this.sqs.count('user', {email: user.email}),
                this.sqs.count('unverified_user', {email: user.email})
            ]);

            if(_.flatten(emails).length > 0) {
                throw this._getValidationError('users.EXISTING_EMAIL');
            }
        }
        _getValidationError(locKey) {
            let err = new Error(this.ls.g(locKey));
            err.code = 400;
            return err;
        }
        _createDBO (payload, contentSettings) {
            let collection = 'user';
            this.successMsg = this.ls.g('login.ACCOUNT_CREATED');

            if(contentSettings.require_verification) {
                collection = 'unverified_user';
                this.successMsg = `${this.ls.g('users.VERIFICATION_SENT')}${payload.email}`;
                payload.verificationCode = pb.util.uniqueId();
            }
            return pb.DocumentCreator.create(collection, payload);

        }
        get payload () {
            return Object.assign({},
                this.body,
                {
                    position: '',
                    photo: null,
                    admin: pb.SecurityService.ACCESS_USER,
                    username: pb.BaseObjectService.sanitize(this.body.username),
                    email: pb.BaseObjectService.sanitize(this.body.email),
                    first_name: pb.BaseObjectService.sanitize(this.body.first_name),
                    last_name: pb.BaseObjectService.sanitize(this.body.last_name)
                });
        }
        get requiredFields () {
            return ['username', 'email', 'password', 'confirm_password'];
        }
    }

    return SignUpController;
};
