Vue.component('site-localization-selector', {
    props: ['availableLocales'],
    data: function () {
        return {
            _availableLocales: this.availableLocales
        }
    },
    template: `
        <div class="locale-selector-widget">
            <ul>
                <li v-for="locale in availableLocales"> 
                    <input type="checkbox" v-model="locale.selected"> {{locale.name}}
                </li>
            </ul>
        </div>
    `
});

// margin: 5px 5px 0 0; for input checkbox
