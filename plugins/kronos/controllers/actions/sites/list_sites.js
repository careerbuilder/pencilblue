module.exports = function (pb) {

    const NUM_SITES_PER_PAGE = 2;

    class ListSitesController extends require('../admin_base_action_controller')(pb) {

        get offsetStart() {
            this.query.pageNumber = this.query.pageNumber || 1;
            return (this.query.pageNumber - 1) * NUM_SITES_PER_PAGE;
        }
        get offsetEnd() {
            this.query.pageNumber = this.query.pageNumber || 1;
            return (this.query.pageNumber - 1) * NUM_SITES_PER_PAGE + NUM_SITES_PER_PAGE;
        }

        async getSites(cb) {
            let siteService = new pb.SiteService();

            if (!this.query.siteType) {
                return this.sendClientError('Site Type must be included', cb);
            }

            let siteMap = (await siteService.getSiteMapAsync())[this.query.siteType];

            this._doSort(siteMap);
            siteMap = this._doSearch(siteMap);

            let maxNumberOfPages = Math.ceil(siteMap.length / NUM_SITES_PER_PAGE);
            let siteList = siteMap.slice(this.offsetStart, this.offsetEnd);

            return this.sendResponse({siteList, maxNumberOfPages}, cb);
        }
        _doSort(siteMap) {
            let sortDirection = this.query.sort && this.query.sort.toLowerCase();
            let sortProp = this.query.sortProp;

            if (sortProp && (sortDirection === 'desc' || sortDirection === 'asc')) {
                siteMap.sort(this._sortSites.bind(this, sortDirection, sortProp));
            }
        }
        _doSearch(siteMap) {
            let searchTerm = this.query.searchTerm || '';
            if(!searchTerm) {
                return siteMap;
            }

            return siteMap.filter(site => {
                return this._check(site, 'displayName', searchTerm) || this._check(site, 'hostname', searchTerm);
            });
        }

        _check(site, prop, filter) {
            return site[prop].includes(filter);
        }

        _sortSites(direction, prop, a, b) {
            let elemA = typeof(a[prop]) === 'string' ? a[prop].toLowerCase() : a[prop];
            let elemB = typeof(b[prop]) === 'string' ? b[prop].toLowerCase() : b[prop];

            if (direction === 'desc') {
                return elemA < elemB;
            }

            return elemA > elemB;
        }

        static getRoutes(cb) {
            return cb(null, [{
                method: 'get',
                path: '/actions/kronos/sites',
                handler: 'getSites',
                auth_required: true,
                inactive_site_access: true,
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                content_type: 'application/json',
                request_body: ['application/json']
            }]);
        }
    }

    return ListSitesController;
};
