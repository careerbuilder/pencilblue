Vue.component('text-setting', {
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
            <input class="form-control text-input" v-model="setting.value">
        </div>
    `
});
