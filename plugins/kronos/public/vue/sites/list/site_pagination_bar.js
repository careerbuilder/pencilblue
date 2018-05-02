Vue.component('site-pagination-bar', {
    created: function () {
        this.$bus.$on('site-update-page-numbers', (pageNumber) => this.maxPageNumber = pageNumber);
        this.$bus.$on('update-site-list-type', (siteType) => this.handleSiteTypeChange(siteType));
    },
    data: function () {
        return {
            maxPageNumber: 1,
            pageNumber: 1,
            siteType: 'active'
        }
    },
    methods: {
        handleSiteTypeChange: function (siteType) {
            this.siteType = siteType;
            this.pageNumber = 1;
        },
        nextPage: function () {
            if (this.pageNumber >= this.maxPageNumber) {
                return;
            }
            this.pageNumber++;
            this.$bus.$emit('update-site-list', {siteType: this.siteType, pageNumber: this.pageNumber});
        },
        previousPage: function () {
            if (this.pageNumber <= 1) {
                return;
            }
            this.pageNumber--;
            this.$bus.$emit('update-site-list', {siteType: this.siteType, pageNumber: this.pageNumber});
        }
    },
    template: `
        <div class="site-pagination-row">
            <a :class="{'disabled': pageNumber === 1, 'pagination-button btn pagination-button-prev':true}" 
                @click="previousPage"><span class="fa fa-fw fa-chevron-left"></span><span>Previous</span></a>
            <span class="pagination-button-spacer"></span>
            <a :class="{'disabled': pageNumber >= maxPageNumber, 'pagination-button btn pagination-button-next':true}" 
                @click="nextPage">
                <span>Next</span><span class="fa fa-fw fa-chevron-right"></span>
            </a>
        </div>
    `
});
