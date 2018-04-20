Vue.component('admin-nav-item', {
    props: ['item'],
    template: `
        <a :href="item.href">
            <span class="fa fa-fw" :class="'fa-'+item.icon"></span> {{item.title}}
        </a>
    `
});
Vue.component('admin-nav-bar', {
    props: ['itemList'],
    methods: {
      getId: function (item) {
          return item.id ?
              item.id :
              `${item.title.toLowerCase().trim().replace(/\s+/g, '-')}-nav-item`;
      }
    },
    template: `
        <ul class="admin-nav-list">
            <li class="admin-nav-item" v-for="item in itemList">
                <div v-if="!item.children">
                    <admin-nav-item v-bind:item="item"></admin-nav-item>
                </div>
                <div v-if="item.children">
                    <a data-toggle="collapse" :data-target="'#' + getId(item)">
                        <admin-nav-item v-bind:item="item"></admin-nav-item>
                    </a>

                    <div :id="getId(item)" class="collapse">
                        <admin-nav-bar v-bind:item-list="item.children"></admin-nav-bar>
                    </div>
                </div>
            </li>
        </ul>
   `
});
