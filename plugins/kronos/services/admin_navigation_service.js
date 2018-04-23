module.exports = function (pb) {

    const NavigationTemplate = require('../lib/navigation/admin_navigation')(pb);

    class AdminNavigationService extends require('./base_service')(pb) {

        static getName () {
            return 'AdminNavigationService';
        }

        static get(session, activeMenuItems, ls, site) {
            let navigation = this._removeUnauthorized(
                session,
                this._buildNavigation(site),
                activeMenuItems
            );

            return this._localizeNavigation(navigation, ls);
        };

        static _removeUnauthorized(session, adminNavigation, activeItems) {
            adminNavigation.forEach((nav, index, collection) => {
                if (nav.access && !pb.security.isAuthorized(session, {admin_level: nav.access})) {
                    collection.splice(index, 1);
                    return;
                }

                if (activeItems.find(item => item === nav.id)) {
                    nav.active = 'active';
                }

                if (nav.children && nav.children.length > 0) {
                    nav.dropdown = 'dropdown';
                    this._removeUnauthorized(session, nav.children, activeItems);
                }
            });

            return adminNavigation;
        };

        static _localizeNavigation(navigation, ls) {
            navigation.forEach((nav) => {
                nav.title = ls.g(nav.title);
                if (Array.isArray(nav.children)) {
                    nav.children = this._localizeNavigation(nav.children, ls);
                }
            });
            return navigation;
        }

        /**************************************************
         * Custom Navigation Handling
         * - Adding new Nav Items (Top level and child)
         * - Removing custom Navigation items
         * - Getting custom nav items
         */
        static addTopLevelNavigationItem(navigationItem, site = pb.SiteService.GLOBAL_SITE) {
            if (this._buildNavigation(site), navigationItem.id) { // TODO: Evaluate replacing this with lodash or something
                return false;
            }

            AdminNavigationService.additions[site] = AdminNavigationService.additions[site] || [];
            AdminNavigationService.additions[site].push(navigationItem);
        }

        static addChildNavigationItem(parentId, navigationItem, site = pb.SiteService.GLOBAL_SITE) {
            if (this._exists(this._buildNavigation(site), navigationItem.id)) { // TODO: Evaluate replacing with lodash
                return false;
            }

            AdminNavigationService.childrenAdditions[site] = AdminNavigationService.childrenAdditions[site] || {};
            let additionsMap = AdminNavigationService.childrenAdditions[site];
            additionsMap[parentId] = additionsMap[parentId] || [];
            additionsMap[parentId].push(navigationItem);
        };

        static remove(navigationId, site = pb.SiteService.GLOBAL_SITE) {
            if (!this._exists(this._buildNavigation(site), navigationId)) {
                return false;
            }
            else if (!this._exists(getDefaultNavigation(site), navigationId)) {
                pb.log.warn(`Admin Navigation: Attempting to remove default Node ${navigationId}`);
                return false;
            }

            function removeNode(id, navigation) {
                let removed = _.remove(navigation, (item) => {
                    return item.id === id
                });
                if (!removed.length) {
                    _.forEach(navigation, (nav) => removeNode(navigationId, nav.children || []));
                }

                return navigation;
            }

            removeNode(navigationId, AdminNavigationService.additions[site] || []);
            removeNode(navigationId, AdminNavigationService.childrenAdditions[site] || []);

            return true;
        };

        static _getCustomNavItems(additions, site) {
            if (additions[site]) {
                return pb.util.clone(additions[site]);
            }
            else if (additions[pb.SiteService.GLOBAL_SITE]) {
                return pb.util.clone(additions[pb.SiteService.GLOBAL_SITE]);
            }
            return pb.util.clone(additions);
        }

        static _exists(navigation, id) {
            let existsInTopLevel = _.some(navigation, {id});

            if (existsInTopLevel) {
                return existsInTopLevel;
            }

            navigation.forEach(nav => {
                if (nav.children && nav.children.length) {
                    existsInTopLevel = existsInTopLevel || _.some(nav.children, {id});
                }
            });
            return existsInTopLevel;
        }

        static _buildNavigation(site) {
            let navigation = [];
            let topLevelAdditions = this._getCustomNavItems(AdminNavigationService.additions, site);
            let childrenAdditions = this._getCustomNavItems(AdminNavigationService.childrenAdditions, site);

            if (pb.config.multisite.enabled) {
                navigation = navigation.concat(getMultiSiteNavigation());
            }

            if (pb.config.multisite.enabled && pb.SiteService.isGlobal(site)) {
                // Don't include content or view site in the nav for multitenancy global scope.
                navigation = navigation.concat(getGlobalScopeNavigation(site));
            }
            else {
                navigation = navigation.concat(getDefaultNavigation(site));
            }

            if(Object.keys(childrenAdditions).length) {
                navigation = navigation.concat(topLevelAdditions);
            }
            //retrieve the nav items to iterate over
            if (!Object.keys(childrenAdditions).length) {
                return navigation;
            }

            //convert to hash to create quick lookup
            let lookup = pb.util.arrayToHash(navigation, function (navigation, i) {
                return navigation[i].id;
            });

            //add additions
            Object.keys(childrenAdditions).forEach(function (id) {
                let children = childrenAdditions[id];

                //find the nav that the children should be added to
                let nav = lookup[id];
                if (!nav) {
                    return;
                }

                if (!Array.isArray(nav.children)) {
                    nav.children = [];
                }
                nav.children = nav.children.concat(children);
            });

            return navigation;
        }
    }

    // Static Constants
    AdminNavigationService.additions = {};
    AdminNavigationService.childrenAdditions = {};


    /****************************************
     * Private utility helpers to build Nav
     * blocks
     */
    function getDefaultNavigation(site) {
        return pb.util.clone([
            NavigationTemplate.CONTENT_NAV,
            NavigationTemplate.PLUGINS_NAV,
            NavigationTemplate.USERS_NAV,
            require('../lib/navigation/settings_admin_navigation')(site, pb),
            NavigationTemplate.VIEW_SITE_NAV,
            NavigationTemplate.LOGOUT_NAV]);
    }

    function getMultiSiteNavigation() {
        return pb.util.clone([NavigationTemplate.MULTISITE_NAV]);
    }

    function getGlobalScopeNavigation(site) {
        return pb.util.clone([
            NavigationTemplate.PLUGINS_NAV,
            NavigationTemplate.USERS_NAV,
            require('../lib/navigation/settings_admin_navigation')(site, pb),
            NavigationTemplate.LOGOUT_NAV
        ]);
    }

    //exports
    return AdminNavigationService;
};
