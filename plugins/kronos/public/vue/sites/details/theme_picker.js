Vue.component('theme-picker', {
    props: ['activeTheme', 'themeOptions'],
    data: function () {
        return {
            _activeTheme: this.activeTheme,
            _themeOptions: this.themeOptions
        };
    },
    methods: {
        submit: function () {
            this.$http.post("/api/plugins/set_theme/" + encodeURIComponent(this.activeTheme))
                .then((resp) => {
                    this.$bus.$emit('show-success-message', {message: resp.data.message, refresh: false});
                })
                .catch((err) => {
                    this.$bus.$emit('show-error-message', err.data);
                });
        }
    },
    template: `
        <div class="theme-selection-row">
            <select v-model="activeTheme" class="form-control">
                <option v-for="theme in themeOptions" :selected="theme.uid === activeTheme">{{theme.uid}}</option>
            </select>
            <a class="btn btn-default" @click="submit"><span class="fa fa-fw fa-check-square-o"></span>Apply Theme</a>
        </div>
    `
});
