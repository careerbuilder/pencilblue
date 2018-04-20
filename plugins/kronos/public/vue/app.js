
Vue.component('search-bar', {
    // props: ['searchTerm'],
    data: () => ({
    searchTerm: '',
    message: ''
}),
    template: `
			<div class="search-bar">
				<input v-model="searchTerm" class="search-bar-input form-control" placeholder="Enter search term here">
				<button class="search-bar-submit-btn form-control btn btn-primary" v-on:click=submit>Submit</button>
			</div>
		`,
    methods: {
    submit: function () {
        alert(`Search for ${this.searchTerm}...`);
    }
}
});


var app = new Vue({
    el: '#kronosapp',
    data: {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a dignissim quam. Phasellus mollis eros eget felis vehicula convallis. Etiam lobortis ut ligula ut vulputate. Donec interdum leo vitae sapien maximus gravida. Curabitur ac sollicitudin nibh, sit amet venenatis diam. Suspendisse euismod, nunc in lacinia ornare, nibh ligula lacinia lacus, quis placerat orci enim sit amet enim. In sem tellus, feugiat non mattis vitae, fermentum eu dolor. Fusce lobortis dolor leo, sit amet sodales tellus tempor ut. Mauris id placerat diam, a posuere velit. Suspendisse efficitur nulla eu ante tristique, non sollicitudin ipsum vehicula. Sed sed nunc diam. Phasellus ligula urna, scelerisque quis metus nec, ultricies scelerisque arcu. Cras turpis diam, euismod ut tortor nec, sollicitudin mattis arcu.\n' +
        '\n' +
        'Aenean placerat commodo viverra. Pellentesque et lobortis elit. Ut volutpat dignissim dignissim. Phasellus sagittis non neque ac tempus. Fusce ac velit accumsan, dignissim risus in, dapibus massa. Ut sed tincidunt est, vel scelerisque sapien. Nullam placerat mauris vestibulum dapibus egestas. Suspendisse vel ex sit amet lacus consequat sollicitudin sit amet euismod erat. Pellentesque pellentesque libero accumsan iaculis euismod. Fusce vel convallis purus. Proin vel pretium risus.\n' +
        '\n' +
        'Aliquam ullamcorper eu turpis ac luctus. Sed a luctus diam. Pellentesque scelerisque a dui in accumsan. Praesent porttitor tellus nec accumsan pulvinar. Ut mollis auctor est, mollis elementum risus commodo eu. Integer quis finibus est. Nulla luctus lacus eu dapibus maximus. Suspendisse vitae maximus tellus, at consectetur dolor. Suspendisse pulvinar neque quis leo commodo, in pellentesque ipsum fermentum. Integer laoreet velit ut fermentum tempor. Fusce at nisl et nunc ultricies consectetur. Praesent ornare dolor eget luctus ultricies. In lacinia turpis felis, sed dignissim est tincidunt ac.\n' +
        '\n' +
        'Integer sagittis sagittis tempor. Sed aliquam arcu sit amet leo interdum mollis eu ac tellus. Morbi non velit blandit, maximus arcu eget, aliquam velit. Suspendisse lacinia, leo vel aliquet sollicitudin, lorem nibh laoreet orci, in iaculis mi dolor eget quam. Duis luctus sapien vel viverra efficitur. Nulla vitae purus at magna consequat vehicula et vitae nunc. Nullam congue, augue vel commodo congue, lorem sem aliquet eros, sed auctor sapien purus non lorem.\n' +
        '\n',
        adminNav: [],
        cluster: []
    },
    methods: {
        basicAction: function () {
            this.message = "I am a basic message";
        },
        changeMessage: function () {
            console.log(this.message);
            this.message = '';
            for(var i = 0; i < 2500; i++)
                this.message += getRandomChar();
            console.log(this.message);
        }
    }
});

Object.keys(__vue_model).forEach(key => app[key] = __vue_model[key]);


function getRandomChar() {
    let random = (Math.random() *100 % 26).toFixed(0);
    let chanceOfSpace = (Math.random() * 100).toFixed(0);
    if(chanceOfSpace <= 5) {
        return ' ';
    }
    return String.fromCharCode(96 + Number(random));
}
