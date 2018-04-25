Vue.component('setting-group-header', {
    props: ['setting'],
    template: `
        <div class="setting-group-heading">
            <h3>{{setting.heading}}</h3>
            <hr>
        </div>
    `
});
