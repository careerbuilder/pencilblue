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

module.exports = function TopMenuServiceModule(pb) {

    // TODO: Rename this to ClientNavigationService
    class TopMenuService extends pb.BaseService {
        constructor(context) {
            super(context);
            this.session = context.session;
            this.settingService = pb.SettingServiceFactory.getService(this.site);
            this.sectionService = this.createService('SectionService');
            this.contentService = this.createService('ContentService');

        }

        async getNavItems(context) {
            let {themeSettings, navigation, accountButtons} = await this.getTopMenu(context);
            ({navigation, accountButtons}) = (await this.getBootstrapNav(navigation, accountButtons, context));
            return {
                themeSettings,
                navigation,
                accountButtons
            };
        };

        /*****
         * Actions related to getting the Account Buttons
         * @returns {Array}
         */
        getAccountButtons() {
            let contentSettings = this.contentService.getSettings();
            let accountButtons = [];

            if (contentSettings.allow_comments) {
                if (pb.SecurityService.isAuthenticated(this.session)) {
                    accountButtons.push(this.userAccountButton, this.rssAccountButton, this.logoutAccountButton);
                }
                else {
                    accountButtons.push(this.userSignupButton, this.rssAccountButton);
                }
            }
            else {
                accountButtons.push(this.rssAccountButton);
            }
            return accountButtons;
        }

        get logoutAccountButton() {
            return {
                icon: 'power-off',
                title: this.ls.get('generic.LOGOUT'),
                href: '/actions/logout'
            };
        }

        get userAccountButton() {
            return {
                icon: 'user',
                title: this.ls.get('admin.ACCOUNT'),
                href: '/user/manage_account'
            };
        }

        get userSignupButton() {
            return {
                icon: 'user',
                title: this.ls.get('admin.ACCOUNT'),
                href: '/user/sign_up'
            };
        }

        get rssAccountButton() {
            return {
                icon: 'rss',
                title: this.ls.get('generic.SUBSCRIBE'),
                href: '/feed'
            };
        }

        /****
         * Actions related to getting the actual navigation data structure
         * @param context
         * @returns {Promise<{siteLogo: *, formattedSections: *, accountButtons: Array}>}
         */
        async getTopMenu(context = {}) { // TODO: Determine if anything else comes in on this
            context.currUrl = context.currUrl || null;

            let siteLogo = await this._getSiteLogo();
            let formattedSections = await this.sectionService.getFormattedSections(this.ls, context.currUrl); // TODO: remove this.ls as a param
            let accountButtons = this.getAccountButtons();

            return {
                siteLogo, formattedSections, accountButtons
            };
        }

        async _getSiteLogo() {
            let logo = await this.settingService.get('site_logo');
            return {site_logo: logo};
        }

        /****
         * Function to format Accounts and Nav Items
         *
         */
        async getBootstrapNav(navigation, accountButtons) {
            if (pb.config.localization.nav) {
                this.ts.setReprocess(true);
            }
            let linkTemplate = this.ts.loadAsync('elements/top_menu/link');
            let dropDownTemplate = this.ts.loadAsync('elements/top_menu/dropdown');
            let accountButtonTemplate = this.ts.loadAsync('elements/top_menu/account_button');

            let bootstrapNav = navigation.map((navItem) => {
                if (!navItem.dropdown) {
                    return this._processBootstrapLink(linkTemplate, navItem);
                }
                navItem.children = navItem.children || [];
                let subNav = navItem.children
                    .map(child => child ? this._processBootstrapLink(linkTemplate, child) : '')
                    .join(' ');

                return dropDownTemplate
                    .split('^navigation^').join(subNav)
                    .split('^active^').join((navItem.active) ? 'active' : '')
                    .split('^name^').join(navItem.name);
            }).join(' ');

            let buttons = accountButtons.map((result, button) => {
                return accountButtonTemplate
                    .split('^active^').join((button.active) ? 'active' : '')
                    .split('^url^').join(button.href)
                    .split('^title^').join(button.title)
                    .split('^icon^').join(button.icon);
            }).join(' ');

            return {bootstrapNav, buttons};
        }
        _processBootstrapLink(template, navItem) {
            return template.split('^active^').join((navItem.active) ? 'active' : '')
                .split('^url^').join(navItem.url)
                .split('^new_tab^').join(navItem.new_tab ? '_blank' : '')
                .split('^name^').join(navItem.name);
        }
    }

    //exports
    return TopMenuService;
};
