Vue.component('boolean-setting', {
    props: ['setting'],

    data: function () {
        return {_setting: this.setting};
    },
    methods: {
        setStatusTrue: function () {
            this.setting.value = true;
            console.log(this.setting.value);
        },
        setStatusFalse: function () {
            this.setting.value = false;
            console.log(this.setting.value)
        },
        getValueStyle: function () {
            return this.setting.value;
        }
    },
    template: `
        <div class="admin-plugin-setting">
            <label>{{setting.displayName}}</label>
            <div class="btn-group">
                <a @click="setStatusTrue" :class="{'selected-btn': getValueStyle(), 'setting-btn': true}">Yes</a>
                <a @click="setStatusFalse" :class="{'selected-btn': !getValueStyle(), 'setting-btn': true}">No</a>
            </div>
        </div>
    `
});
