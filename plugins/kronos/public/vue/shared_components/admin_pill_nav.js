Vue.component('pill', {
   props: ['pill'],
   template: `
        <a :id="pill.name" class="pill" :href="pill.href">
            <span class="fa fa-fw" :class="'fa fa-fw fa-'+pill.icon"></span>{{pill.title}}
        </a>
   `
});
Vue.component('pill-nav', {
    props: ['pills'],
    template: `
        <div id="pill-nav">
            <pill v-for="pill in pills" v-bind:pill="pill"></pill>
        </div>
    `
});
