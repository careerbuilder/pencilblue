Vue.component('site-grid', {
    created: function () {
        this.$bus.$on('update-site-list', (params) => this.refreshData(params));
        this.$bus.$on('update-site-list-type', (siteType) => this.handleSiteTypeChange(siteType));
        this.refreshData({siteType: this.siteType});
    },
    data: function () {
        return {
            siteType: 'active',
            siteList: [],
            sortDirection: '',
            sortProp: ''
        }
    },
    methods: {
        handleSiteTypeChange: function (siteType) {
            this.siteType = siteType;
            this.$bus.$emit('update-site-records-type', siteType);
            this.refreshData({searchTerm: ''});
        },
        refreshData: function (qsVars) {
            this.$http.get('/actions/kronos/sites', this._buildQuery(qsVars))
                .then((res) => this._updateSiteData(res && res.data || {}))
                .catch(err => this.$bus.$emit('show-error-message', err));
        },
        sortSites: function (sortProp) {
            alert(sortProp);
            this.sortDirection = sortProp === this.sortProp && this.sortDirection === 'asc' ? 'desc' : 'asc';
            this.sortProp = sortProp;
            this.refreshData({sort: this.sortDirection, sortProp});
        },
        _buildQuery: function (qsVars) {
            qsVars.siteType = this.siteType;
            qsVars.searchTerm = typeof(qsVars.searchTerm) === 'string' ? qsVars.searchTerm : this._searchTerm;
            this._searchTerm = qsVars.searchTerm;
            return qsVars;
        },
        _updateSiteData: function (data) {
            let siteList = data.siteList || [];
            let maxNumberOfPages = data.maxNumberOfPages || 1;
            if (siteList && siteList.length) {
                this.siteList = siteList;
                this.$bus.$emit('site-update-page-numbers', maxNumberOfPages);
            }
        }
    },
    template: `
        <div class="site-data-grid panel panel-default">
            <div class="panel-heading">
                {{siteType}} Sites&nbsp;<i class="fa fa-info-circle" data-toggle="tooltip" data-placement="bottom"></i>
            </div>
            <table class="table">
                <thead>
                    <tr>                
                        <th><span @click="sortSites('displayName')">Display Name</span></th>
                        <th><span @click="sortSites('hostname')">Hostname</span></th>
                        <th><span @click="sortSites('created')">Date Added</span></th>
                    </tr>
                </thead>
                <tbody>
                    <site-record v-for="site in siteList" :key="site.uid" :site="site" :site-type="siteType"></site-record>
                </tbody>
            </table>
        </div>
    `
});
