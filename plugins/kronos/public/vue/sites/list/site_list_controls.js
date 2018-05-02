Vue.component('site-list-controls', {
    data: function () {
        return {
            siteType: 'active'
        }
    },
    methods: {
        changeSiteListType: function (siteType) {
            this.siteType = siteType;
            this.$bus.$emit('update-site-list-type', siteType);
        }
    },
    template: `
        <div class="site-list-controls-row">
            <a :class="{'active btn-primary': siteType === 'active', 'btn-standard': siteType !== 'active', 'btn active-site-button': true}" 
                @click="changeSiteListType('active')">Active Sites</a>
            <a :class="{'active btn-primary': siteType === 'inactive', 'btn-standard': siteType !== 'inactive', 'btn active-site-button': true}" 
                @click="changeSiteListType('inactive')">Inactive Sites</a>
        </div>
    `
});
