Vue.component('site-search-bar', {
    created: function () {
        this.$bus.$on('update-site-list-type', (st) => this.handleSiteTypeChange(st));
    },
    data: function () {
        return {
            siteType: 'active',
            searchTerm: ''
        }
    },
    methods: {
        handleSiteTypeChange: function(siteType) {
            this.siteType = siteType;
            this.searchTerm = '';
        },
        search: function () {
            this.$bus.$emit('update-site-list', {siteType: this.siteType, searchTerm: this.searchTerm});
        }
    },
    template: `
        <div class="site-search-bar-row">
            <input class="form-control" @keyup.enter="search" v-model="searchTerm">
            <a class="btn btn-standard" @click="search">
                <span class="fa fw fa-search"></span>
            </a>
        </div>
    `
});
