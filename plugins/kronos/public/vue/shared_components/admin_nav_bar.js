Vue.component('admin-nav-item', {
    props: ['item'],
    template: `
        <a :class="'admin-nav-item ' + item.active" :href="item.href">
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
            <li class="admin-nav-row" v-for="item in itemList">
                <admin-nav-item  v-if="!item.children" :item="item"></admin-nav-item>
                <div v-if="item.children">
                    <a data-toggle="collapse" :data-target="'#' + getId(item)">
                        <admin-nav-item :item="item"></admin-nav-item>
                    </a>

                    <div :id="getId(item)" class="admin-sub-nav-list collapse">
                        <admin-nav-bar :item-list="item.children"></admin-nav-bar>
                    </div>
                </div>
            </li>
        </ul>
   `
});
