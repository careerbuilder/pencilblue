/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/vue/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/vue/app.js":
/*!***************************!*\
  !*** ./public/vue/app.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.prototype.$bus = new Vue({});
Vue.prototype.refreshPage = function () {
    window.location.href = window.location.href;
};

const app = new Vue({
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
        store: {},
        navigation: [],
        pills: [],
        pluginData: {}
    }
});

Object.keys(__vue_model).forEach(key => {
    app[key] = __vue_model[key]; // @deprecated
    app.store[key] = __vue_model[key];
});


/***/ }),

/***/ "./public/vue/index.js":
/*!*****************************!*\
  !*** ./public/vue/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared_components */ "./public/vue/shared_components/index.js");
/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugins */ "./public/vue/plugins/index.js");
/* harmony import */ var _sites__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sites */ "./public/vue/sites/index.js");
/* harmony import */ var _users__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./users */ "./public/vue/users/index.js");
/* harmony import */ var _server_records__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./server_records */ "./public/vue/server_records.js");
/* harmony import */ var _server_records__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_server_records__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app */ "./public/vue/app.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_app__WEBPACK_IMPORTED_MODULE_5__);
// import '../scss/test.scss'




 // TODO: Move this to a folder



console.log("I am Kronos Titan of Time");


/***/ }),

/***/ "./public/vue/plugins/index.js":
/*!*************************************!*\
  !*** ./public/vue/plugins/index.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _plugin_grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plugin_grid */ "./public/vue/plugins/plugin_grid.js");
/* harmony import */ var _plugin_grid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_plugin_grid__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _plugin_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugin_settings */ "./public/vue/plugins/plugin_settings.js");
/* harmony import */ var _plugin_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_plugin_settings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings */ "./public/vue/plugins/settings/index.js");





/***/ }),

/***/ "./public/vue/plugins/plugin_grid.js":
/*!*******************************************!*\
  !*** ./public/vue/plugins/plugin_grid.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('plugin-installed-options', {
    props: ['plugin', 'isActive'],
    methods: {
        resetSettings: function () {
            this.$http.post("/api/plugins/reset_settings/" + encodeURIComponent(this.plugin.uid))
                .then(() => this.$bus.$emit('show-success-message', 'Successfully reset settings'))
                .catch((error) => this.$bus.$emit('show-error-message', error.data));
        },
        initializePlugin: function () {
            this.$http.post("/api/plugins/initialize/" + encodeURIComponent(this.plugin.uid))
                .then(() => this.$bus.$emit('show-success-message', 'Successfully re-initialized settings'))
                .catch((error) => this.$bus.$emit('show-error-message', error.data));
        },
        uninstallPlugin: function () {
            this.$http.post("/api/plugins/uninstall/" + encodeURIComponent(this.plugin.uid))
                .then((result) => {
                    let jobId = result.data;
                    this.$bus.$emit('show-modal', jobId);
                })
                .catch((error) => this.$bus.$emit('show-error-message', error.data));
        }
    },
    template: `
        <div class="btn-group plugin-setting-btn-group">
            <a class="plugin-settings-btn" :href="'/kronos/plugins/' + plugin.uid + '/settings'">
                <i class="fa fa-cog"></i>&nbsp;Settings
            </a>
            <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-sm fa-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li><a v-on:click="resetSettings"><i class="fa fa-fw fa-refresh"></i>&nbsp;Reset Settings</a></li>
                <li><a v-on:click="initializePlugin" v-if="!isActive"><i class="fa fa-fw fa-check"></i>&nbsp;Initialize</a></li>
                <li><a v-on:click="uninstallPlugin"><i class="fa fa-fw fa-ban"></i>&nbsp;Uninstall</a></li>
            </ul>
        </div>
    `
});

Vue.component('plugin-info-row', {
    props: ['plugin', 'settingState'],
    template: `
        <tr>        
            <td class="plugin-name-column regular"><a :href="'/kronos/plugins/' + plugin.uid">{{plugin.uid}}</a></td>
            <td></td>
            <td class="plugin-date-column">{{plugin.created | format-date}}</td>
            <td class="plugin-settings-column">
                <plugin-installed-options v-if="settingState === 'active'" :plugin="plugin" :isActive="true"></plugin-installed-options>
                <plugin-installed-options v-if="settingState === 'inactive'" :plugin="plugin" :isActive="false"></plugin-installed-options>
                <plugin-available-options v-if="settingState === 'available'" :plugin="plugin"></plugin-available-options>
            </td>
        </tr>
   `
});

Vue.component('plugin-uninstalled-info-row', {
    props: ['plugin'],
    methods: {
        install: function () {
            this.$http.post("/api/plugins/install/" + encodeURIComponent(this.plugin.uid))
                .then((result) => {
                    let jobId = result.data;
                    this.$bus.$emit('show-modal', jobId);
                })
                .catch((error) =>  this.$bus.$emit('show-error-message', error.data));
        }
    },
    template: `
        <tr>
            <td class="plugin-name-column uninstall"><a :href="'/kronos/plugins/' + plugin.uid">{{plugin.uid}}</a></td>
            <td></td>
            <td class="plugin-description-column">{{plugin.description}}</td>
            <td class="plugin-settings-column">
                <div class="btn-group plugin-setting-btn-group">
                    <a class="plugin-settings-btn" v-on:click="install">
                        <span class="fa fa-hdd-o"></span>&nbsp;Install
                    </a>
                </div>
            </td>
        </tr>
   `
});
Vue.component('plugin-grid', {
    props: ['pluginList', 'listTitle', 'settingState'],
    template: `
   <div class="plugin-grid panel panel-default">
        <div class="panel-heading">
            {{listTitle}}&nbsp;
            <i class="fa fa-info-circle" data-toggle="tooltip" data-placement="bottom"></i>
        </div>
        <table class="table">
            <thead>
                <tr>                
                    <th>Name</th>
                    <th></th>
                    <th>Installed On</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <plugin-uninstalled-info-row  v-for="plugin in pluginList" :key="plugin.uid" v-if="settingState === 'available'" :plugin="plugin" :setting-state="settingState"></plugin-uninstalled-info-row>                
                <plugin-info-row  v-for="plugin in pluginList" :key="plugin.uid" v-if="settingState !== 'available'" :plugin="plugin" :setting-state="settingState"></plugin-info-row>                
            </tbody>
        </table>
    </div>
   `
});


/***/ }),

/***/ "./public/vue/plugins/plugin_settings.js":
/*!***********************************************!*\
  !*** ./public/vue/plugins/plugin_settings.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('plugin-settings', {
    props: ['pluginUid', 'settings'],
    data: function () {
        return {
            _settings: this.settings
        }
    },
    methods: {
        submit: function () {
            this.$http.post(`/actions/kronos/plugins/${this.pluginUid}/settings`, {settings: this.settings})
                .then((resp) => {
                    this.$bus.$emit('show-success-message', {message: resp.data, refresh: true});
                })
                .catch((err) => {
                    this.$bus.$emit('show-error-message', err.data);
                });
        }
    },
    template: `
        <div class="admin-plugin-settings-list">
            <div v-for="setting in settings">
                <setting-group-header :setting="setting" v-if="setting.isHeading && setting.heading !== 'Default'"></setting-group-header>
                <text-setting :setting="setting" v-if="setting.type === 'text'"></text-setting>
                <boolean-setting :setting="setting" v-if="setting.type === 'checkbox'"></boolean-setting>
            </div>
            <hr> 
            <div class="admin-plugin-setting-control-bar">
                <a class="btn btn-default" href="/kronos/plugins">
                    <i class="fa fa-ban"></i>&nbsp;Cancel
                </a>
                <a class="btn btn-primary btn-save" @click="submit">
                    <i class="fa fa-save" ng-class="{'fa-save': !saving, 'fa-circle-o-notch fa-spin': saving}"></i>&nbsp;Save
                </a>
            </div>   
        </div>
    `
});


/***/ }),

/***/ "./public/vue/plugins/settings/boolean_setting.js":
/*!********************************************************!*\
  !*** ./public/vue/plugins/settings/boolean_setting.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./public/vue/plugins/settings/index.js":
/*!**********************************************!*\
  !*** ./public/vue/plugins/settings/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _boolean_setting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boolean_setting */ "./public/vue/plugins/settings/boolean_setting.js");
/* harmony import */ var _boolean_setting__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_boolean_setting__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _numeric_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./numeric_setting */ "./public/vue/plugins/settings/numeric_setting.js");
/* harmony import */ var _numeric_setting__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_numeric_setting__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _string_setting__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./string_setting */ "./public/vue/plugins/settings/string_setting.js");
/* harmony import */ var _string_setting__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_string_setting__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _setting_group_header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./setting_group_header */ "./public/vue/plugins/settings/setting_group_header.js");
/* harmony import */ var _setting_group_header__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_setting_group_header__WEBPACK_IMPORTED_MODULE_3__);






/***/ }),

/***/ "./public/vue/plugins/settings/numeric_setting.js":
/*!********************************************************!*\
  !*** ./public/vue/plugins/settings/numeric_setting.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('numeric-setting', {
    props: ['setting'],
    template: `
        
    `
});


/***/ }),

/***/ "./public/vue/plugins/settings/setting_group_header.js":
/*!*************************************************************!*\
  !*** ./public/vue/plugins/settings/setting_group_header.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('setting-group-header', {
    props: ['setting'],
    template: `
        <div class="setting-group-heading">
            <h3>{{setting.heading}}</h3>
            <hr>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/plugins/settings/string_setting.js":
/*!*******************************************************!*\
  !*** ./public/vue/plugins/settings/string_setting.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./public/vue/server_records.js":
/*!**************************************!*\
  !*** ./public/vue/server_records.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('server-record', {
   props: ['record'],
   template: `
        <tr ng-repeat="val in cluster" class="ng-scope">
            <td>{{record.ip}}::{{record.port}}</td>
            <td title="1">{{record.process_type}}</td>
            <td><span>{{record.uptime}}</span> Secs</td>
            <td><span> {{record.mem_usage.heapUsed / 1024 / 1024}}</span> MB</td>
            <td><span>{{record.requests}}</span></td>
            <td><span>{{record.currentRequests}}</span></td>
        </tr> 
   ` // TODO: Eval if there is more good data to show here
});
Vue.component('server-record-table', {
    props: ['serverRecordList'],
    methods: {
        // TODO: implement the get that refreshes this table
    },
    template: `
        <table class="table table-hover">
            <thead>
                <tr class="thead-light">
                    <th>Server</th>
                    <th>Process Type</th>
                    <th>Uptime</th>
                    <th>Memory Used</th>
                    <th>Requests</th>
                    <th>Current Requests </th>
                </tr>
            </thead>
            <tbody>
                <server-record v-for="record in serverRecordList" v-bind:record="record"></server-record>         
            </tbody>
        </table>
    `
});


/***/ }),

/***/ "./public/vue/shared_components/filters/format_date.js":
/*!*************************************************************!*\
  !*** ./public/vue/shared_components/filters/format_date.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.filter('format-date', function (date) {
    if (date) {
        let dateObj = new Date(date);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
    }
});


/***/ }),

/***/ "./public/vue/shared_components/filters/index.js":
/*!*******************************************************!*\
  !*** ./public/vue/shared_components/filters/index.js ***!
  \*******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _format_date__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format_date */ "./public/vue/shared_components/filters/format_date.js");
/* harmony import */ var _format_date__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_format_date__WEBPACK_IMPORTED_MODULE_0__);



/***/ }),

/***/ "./public/vue/shared_components/index.js":
/*!***********************************************!*\
  !*** ./public/vue/shared_components/index.js ***!
  \***********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navigation */ "./public/vue/shared_components/navigation/index.js");
/* harmony import */ var _messaging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./messaging */ "./public/vue/shared_components/messaging/index.js");
/* harmony import */ var _filters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filters */ "./public/vue/shared_components/filters/index.js");





/***/ }),

/***/ "./public/vue/shared_components/messaging/error_message.js":
/*!*****************************************************************!*\
  !*** ./public/vue/shared_components/messaging/error_message.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('error-message', {
    created: function () {
        this.$bus.$on('show-error-message', (message) => this.updateMessage(message));
    },
    data: function () {
        return {
            message: ''
        };
    },
    methods: {
        updateMessage: function (message) {
            this.message = message;
        },
        clearMessage: function () {
            this.message = '';
        }
    },
    template: `
        <div v-if="message" class="alert alert-danger"> 
            <span>{{message}} </span><span class="alert-clear-btn" @click="clearMessage">X</span>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/shared_components/messaging/index.js":
/*!*********************************************************!*\
  !*** ./public/vue/shared_components/messaging/index.js ***!
  \*********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _success_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./success_message */ "./public/vue/shared_components/messaging/success_message.js");
/* harmony import */ var _success_message__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_success_message__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _error_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error_message */ "./public/vue/shared_components/messaging/error_message.js");
/* harmony import */ var _error_message__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_error_message__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _job_runner_modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./job_runner_modal */ "./public/vue/shared_components/messaging/job_runner_modal.js");
/* harmony import */ var _job_runner_modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_job_runner_modal__WEBPACK_IMPORTED_MODULE_2__);





/***/ }),

/***/ "./public/vue/shared_components/messaging/job_runner_modal.js":
/*!********************************************************************!*\
  !*** ./public/vue/shared_components/messaging/job_runner_modal.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('job-runner-modal', {
    created: function () {
        this.$bus.$on('show-modal', (jobId) => this.runModal(jobId));
    },
   data: function () {
       return {
           actionError: '',
           actionIsComplete: false,
           actionProgress: 0,
           consoleOutput: '',
           _logStartingPoint: 0,
           _nextJobStatusHandler: null,
           _nextLogRetrieveHandler: null
       };
    },
    methods: {
        closeAndRefresh: function () {
            window.location.reload();
        },
        runModal: function (result) {
            let jobId = result && result.data;

            $('#progress_modal').modal({});

            this._resetModalDataModel();
            this._retrieveLogs(jobId);
            this._retrieveJobStatus(jobId);
        },
        _resetModalDataModel: function () {
            this.actionError = '';
            this.actionIsComplete = false;
            this.actionProgress = 0;
            this.consoleOutput = '';
            this._logStartingPoint = 0;
            this._nextJobStatusHandler = null;
            this._nextLogRetrieveHandler = null;
        },
        _doAction: function (actionType, identifier, data) {
            return this.$http.post("/api/jobs/" + actionType + "/" + encodeURIComponent(identifier), data)
                .then((result) => {
                    if (result.data && result.data.data && result.data.data.status === 'ERRORED') {
                        throw {message: result.data.data.error};
                    }
                    return result;
                })
                .catch((err) => this._handleError(err));
        },
        _handleError: function (err) {
            this.actionIsComplete = true;
            this.actionError = err.message;
        },
        _addToLog: function (line) {
            let lineStart = this.consoleOutput.length ? '\n' : '';

            this.consoleOutput += `${lineStart}${line}`;
        },
        _retrieveJobStatus: function(jobId) {
            return this._doAction('get', jobId, {})
                .then(result => {
                    if (!result || !result.data || !result.data.data) {
                        return this._handleError(new Error('Result did not have data.  Most likely a Job ID was not valid.  Try restarting the task.'));
                    }
                    let data = result.data.data; // TODO: Fix this on the API side
                    let progress = data.progress;

                    if (!isNaN(progress)) {
                        this.actionProgress = progress.toString();
                    }

                    if (data.status === 'RUNNING') {
                        return this._nextJobStatusHandler = setTimeout(this._retrieveJobStatus.bind(this, jobId), 1000);
                    }
                    else if(data.status === 'COMPLETED') {
                        this.actionIsComplete = true;
                    }

                    setTimeout(() => {
                        clearTimeout(this._nextLogRetrieveHandler); // immediately call the last cursor

                        let resultLine = data.status || '';
                        resultLine += data.errors ? `: ${data.error}` : '';

                        this._addToLog(resultLine);

                       this.closeAndRefresh();
                    }, 1500);
                })
        },
        _retrieveLogs: function (jobId) {
            return this._doAction('getLogs', jobId, {starting: this._logStartingPoint})
                .then((result) => {
                    if (!result || !result.data || !result.data.data || !result.data.data.length) {
                        return this._nextLogRetrieveHandler = setTimeout(this._retrieveLogs.bind(this, jobId), 2000);
                    }

                    let data = result.data.data;

                    let nextStarting = this._logStartingPoint;
                    data.forEach(res => {
                        this._addToLog(`${res.created}:[${res.worker_id}] ${res.message}`);

                        let date = new Date(res.created).getTime();
                        if(date > nextStarting) {
                            nextStarting = date;
                        }
                    });

                    //offset so we don't get repeats
                    this._logStartingPoint = nextStarting + 1;

                    //check for more log entries
                    return this._nextLogRetrieveHandler = setTimeout(this._retrieveLogs.bind(this, jobId), 2000);
                });
        }
    },
    template: `
        <div id="progress_modal" class="modal fade" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            <span v-if="actionIsComplete">Action is Complete!</span>
                            <span v-else>Action is in progress...</span>
                        </h4>
                    </div>
                    <div class="modal-body loading-modal-content">
                        <div class="progress">
                            <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" :aria-valuenow="actionProgress" aria-valuemin="0" aria-valuemax="100" :style="{'width': actionProgress + '%'}"></div>
                        </div>
                        <textarea class="progress-console" rows="5" wrap="off" v-model="consoleOutput" v-if="consoleOutput.length"></textarea>
                        <div class="alert alert-danger" v-if="actionError">An Error Occurred: {{actionError}}</div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" v-on:click="closeAndRefresh" :disabled="!actionIsComplete">
                            <i class="fa fa-check"></i>&nbsp;Okay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/shared_components/messaging/success_message.js":
/*!*******************************************************************!*\
  !*** ./public/vue/shared_components/messaging/success_message.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('success-message', {
    created: function () {
        this.$bus.$on('show-success-message', (params) => this.updateMessage(params));
    },
    data: function () {
        return {
            message: ''
        };
    },
    methods: {
        updateMessage: function (params = {}) {
            this.message = params.message || params;
            setTimeout(() => params.refresh ? this.refreshPage() : this.clearMessage(), 2000);
        },
        clearMessage: function () {
          this.message = '';
        }
    },
    template: `
        <transition name="fade">
            <div v-if="message" class="alert alert-success"> 
                <span>{{message}} </span> <span class="alert-clear-btn" @click="clearMessage">X</span>
            </div>
        </transition>
    `
});


/***/ }),

/***/ "./public/vue/shared_components/navigation/admin_nav_bar.js":
/*!******************************************************************!*\
  !*** ./public/vue/shared_components/navigation/admin_nav_bar.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./public/vue/shared_components/navigation/admin_pill_nav.js":
/*!*******************************************************************!*\
  !*** ./public/vue/shared_components/navigation/admin_pill_nav.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('pill', {
   props: ['pill'],
   template: `
        <a :id="pill.name" class="btn-primary pill" :href="pill.href">
            <span class="fa fa-fw" :class="'fa fa-fw fa-'+pill.icon"></span>{{pill.title}}
        </a>
   `
});
Vue.component('pill-nav', {
    props: ['pills'],
    template: `
        <div id="pill-nav">
            <pill v-for="pill in pills" :key="pill.id" :pill="pill"></pill>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/shared_components/navigation/index.js":
/*!**********************************************************!*\
  !*** ./public/vue/shared_components/navigation/index.js ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _admin_pill_nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin_pill_nav */ "./public/vue/shared_components/navigation/admin_pill_nav.js");
/* harmony import */ var _admin_pill_nav__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_admin_pill_nav__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _admin_nav_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin_nav_bar */ "./public/vue/shared_components/navigation/admin_nav_bar.js");
/* harmony import */ var _admin_nav_bar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_admin_nav_bar__WEBPACK_IMPORTED_MODULE_1__);




/***/ }),

/***/ "./public/vue/sites/details/site_localization_selector.js":
/*!****************************************************************!*\
  !*** ./public/vue/sites/details/site_localization_selector.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./public/vue/sites/details/site_routing_info.js":
/*!*******************************************************!*\
  !*** ./public/vue/sites/details/site_routing_info.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('site-routing-form', {
   props: ['site'],
   data: function () {
        return {
            _site: this.site
        }
   },
    methods: {

    },
    template: `
        <div class="site-routing-row">
            <label>Display Name</label>
            <input class="form-control" v-model="site.displayName">
            <label>Hostname</label>
            <input class="form-control" v-model="site.hostname">
        </div>
        `
});


/***/ }),

/***/ "./public/vue/sites/index.js":
/*!***********************************!*\
  !*** ./public/vue/sites/index.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list_site_grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list/site_grid */ "./public/vue/sites/list/site_grid.js");
/* harmony import */ var _list_site_grid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_list_site_grid__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _list_site_list_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list/site_list_controls */ "./public/vue/sites/list/site_list_controls.js");
/* harmony import */ var _list_site_list_controls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_list_site_list_controls__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _details_site_localization_selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./details/site_localization_selector */ "./public/vue/sites/details/site_localization_selector.js");
/* harmony import */ var _details_site_localization_selector__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_details_site_localization_selector__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _list_site_pagination_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./list/site_pagination_bar */ "./public/vue/sites/list/site_pagination_bar.js");
/* harmony import */ var _list_site_pagination_bar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_list_site_pagination_bar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _details_site_routing_info__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./details/site_routing_info */ "./public/vue/sites/details/site_routing_info.js");
/* harmony import */ var _details_site_routing_info__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_details_site_routing_info__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _list_site_search_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./list/site_search_bar */ "./public/vue/sites/list/site_search_bar.js");
/* harmony import */ var _list_site_search_bar__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_list_site_search_bar__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _list_active_site_setting_btn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./list/active_site_setting_btn */ "./public/vue/sites/list/active_site_setting_btn.js");
/* harmony import */ var _list_active_site_setting_btn__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_list_active_site_setting_btn__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _list_inactive_site_setting_btn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./list/inactive_site_setting_btn */ "./public/vue/sites/list/inactive_site_setting_btn.js");
/* harmony import */ var _list_inactive_site_setting_btn__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_list_inactive_site_setting_btn__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _list_site_record__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./list/site_record */ "./public/vue/sites/list/site_record.js");
/* harmony import */ var _list_site_record__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_list_site_record__WEBPACK_IMPORTED_MODULE_8__);











/***/ }),

/***/ "./public/vue/sites/list/active_site_setting_btn.js":
/*!**********************************************************!*\
  !*** ./public/vue/sites/list/active_site_setting_btn.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('active-site-setting-btn', {
    props: ['site'],
    methods: {
        deleteSite: function () {
            this.$http.delete('/actions/admin/sites/delete/' + this.site.uid)
                .then((res) => this.$bus.$emit('show-success-message', res.message))
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        },
        deactivateSite: function () {
            console.log('Deactivating...');
            this.$http.post('/actions/admin/sites/deactivate/' + this.site.uid)
                .then((result) => this.$bus.$emit('show-modal', result.data))
                .catch((error) => this.$bus.$emit('show-error-message', error.message))
        },
        tokenJump: function () {
            let data = {}; // this has a token and should be on this or something
            let url = '//' + this.site.hostname + '/actions/admin/sites/token_login?callback=angular.callbacks._0&token=' + data.token;
            this.$http.jsonp(url)
                .then((result) => {
                    this.$bus.$emit('show-success-message', result.message);
                    setTimeout(() => window.location = `//${this.site.hostname}/kronos`, 1500);
                })
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        }
    },
    template: `
        <div class="btn-group site-setting-btn-group">
            <a class="btn btn-standard site-settings-btn" :href="'/kronos/sites/' + site.uid">
                <i class="fa fa-cog"></i>&nbsp;Edit Site
            </a>
            <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-sm fa-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li><a @click="deactivateSite"><i class="fa fa-fw fa-remove"></i>&nbsp;Deactivate</a></li>
            </ul>
        </div>
   `
});


/***/ }),

/***/ "./public/vue/sites/list/inactive_site_setting_btn.js":
/*!************************************************************!*\
  !*** ./public/vue/sites/list/inactive_site_setting_btn.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('inactive-site-setting-btn', {
    props: ['site'],
    methods: {
        activateSite: function () {
            this.$http.post('/actions/admin/sites/activate/' + this.site.uid)
                .then((res) => this.$bus.$emit('show-modal', res.data))
                .catch((err) => this.$bus.$emit('show-error-message', err.message))
        },
        deleteSite: function () {
            this.$http.delete('/actions/admin/sites/delete/' + this.site.uid)
                .then((res) => this.$bus.$emit('show-success-message', res.message))
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        }
    },
    template: `
        <div class="btn-group site-setting-btn-group">
            <a class="btn btn-standard site-settings-btn" :href="'/kronos/sites/' + site.uid">
                <i class="fa fa-cog"></i>&nbsp;Edit Site
            </a>
            <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-sm fa-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li><a @click="activateSite"><i class="fa fa-fw fa-plus"></i>&nbsp;Activate</a></li>
                <li><a @click="deleteSite"><i class="fa fa-fw fa-trash"></i>&nbsp;Delete</a></li>
            </ul>
        </div>
   `
});


/***/ }),

/***/ "./public/vue/sites/list/site_grid.js":
/*!********************************************!*\
  !*** ./public/vue/sites/list/site_grid.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('site-grid', {
    created: function () {
        this.$bus.$on('update-site-list', (params) => this.refreshData(params));
        this.$bus.$on('update-site-list-type', (siteType) => this.handleSiteTypeChange(siteType));
        this.refreshData({siteType: this.siteType});
    },
    data: function () {
        return {
            siteType: 'active',
            siteList: [],
            sortDirection: '',
            sortProp: ''
        }
    },
    methods: {
        handleSiteTypeChange: function (siteType) {
            this.siteType = siteType;
            this.$bus.$emit('update-site-records-type', siteType);
            this.refreshData({searchTerm: ''});
        },
        refreshData: function (qsVars) {
            this.$http.get('/actions/kronos/sites', this._buildQuery(qsVars))
                .then((res) => this._updateSiteData(res && res.data || {}))
                .catch(err => this.$bus.$emit('show-error-message', err));
        },
        sortSites: function (sortProp) {
            alert(sortProp);
            this.sortDirection = sortProp === this.sortProp && this.sortDirection === 'asc' ? 'desc' : 'asc';
            this.sortProp = sortProp;
            this.refreshData({sort: this.sortDirection, sortProp});
        },
        _buildQuery: function (qsVars) {
            qsVars.siteType = this.siteType;
            qsVars.searchTerm = typeof(qsVars.searchTerm) === 'string' ? qsVars.searchTerm : this._searchTerm;
            this._searchTerm = qsVars.searchTerm;
            return qsVars;
        },
        _updateSiteData: function (data) {
            let siteList = data.siteList || [];
            let maxNumberOfPages = data.maxNumberOfPages || 1;
            if (siteList && siteList.length) {
                this.siteList = siteList;
                this.$bus.$emit('site-update-page-numbers', maxNumberOfPages);
            }
        }
    },
    template: `
        <div class="site-data-grid panel panel-default">
            <div class="panel-heading">
                {{siteType}} Sites&nbsp;<i class="fa fa-info-circle" data-toggle="tooltip" data-placement="bottom"></i>
            </div>
            <table class="table">
                <thead>
                    <tr>                
                        <th><span @click="sortSites('displayName')">Display Name</span></th>
                        <th><span @click="sortSites('hostname')">Hostname</span></th>
                        <th><span @click="sortSites('created')">Date Added</span></th>
                    </tr>
                </thead>
                <tbody>
                    <site-record v-for="site in siteList" :key="site.uid" :site="site" :site-type="siteType"></site-record>
                </tbody>
            </table>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/sites/list/site_list_controls.js":
/*!*****************************************************!*\
  !*** ./public/vue/sites/list/site_list_controls.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./public/vue/sites/list/site_pagination_bar.js":
/*!******************************************************!*\
  !*** ./public/vue/sites/list/site_pagination_bar.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('site-pagination-bar', {
    created: function () {
        this.$bus.$on('site-update-page-numbers', (pageNumber) => this.maxPageNumber = pageNumber);
        this.$bus.$on('update-site-list-type', (siteType) => this.handleSiteTypeChange(siteType));
    },
    data: function () {
        return {
            maxPageNumber: 1,
            pageNumber: 1,
            siteType: 'active'
        }
    },
    methods: {
        handleSiteTypeChange: function (siteType) {
            this.siteType = siteType;
            this.pageNumber = 1;
        },
        nextPage: function () {
            if (this.pageNumber >= this.maxPageNumber) {
                return;
            }
            this.pageNumber++;
            this.$bus.$emit('update-site-list', {siteType: this.siteType, pageNumber: this.pageNumber});
        },
        previousPage: function () {
            if (this.pageNumber <= 1) {
                return;
            }
            this.pageNumber--;
            this.$bus.$emit('update-site-list', {siteType: this.siteType, pageNumber: this.pageNumber});
        }
    },
    template: `
        <div class="site-pagination-row">
            <a :class="{'disabled': pageNumber === 1, 'pagination-button btn pagination-button-prev':true}" 
                @click="previousPage"><span class="fa fa-fw fa-chevron-left"></span><span>Previous</span></a>
            <span class="pagination-button-spacer"></span>
            <a :class="{'disabled': pageNumber >= maxPageNumber, 'pagination-button btn pagination-button-next':true}" 
                @click="nextPage">
                <span>Next</span><span class="fa fa-fw fa-chevron-right"></span>
            </a>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/sites/list/site_record.js":
/*!**********************************************!*\
  !*** ./public/vue/sites/list/site_record.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('site-record', {
    props: ['site', 'siteType'],
    data: function () {
        return {
            _site: this.site,
            _siteType: this.siteType,
            _searchTerm: ''
        };
    },
    methods: {
        authUserToSite: function () {
            this.$http.post(`/actions/admin/sites/auth_token/${encodeURIComponent(this.site.uid)}`)
                .then((res) => {
                    this.$bus.$emit('show-success-message', res.data.message);
                    this._handleTokenCreation(res.data.data);
                })
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        },
        _handleTokenCreation: function (data) {
            let url = '//' + this.site.hostname + '/actions/admin/sites/token_login?token=' + data.token;
            this.$http.jsonp(url)
                .then((result) => {
                    this.$bus.$emit('show-success-message', result.data.message);
                    setTimeout(() => window.location = `//${this.site.hostname}/kronos`, 1500);
                })
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        }
    },
    template: `
        <tr>
            <td class="simulated-link" @click="authUserToSite">{{site.displayName}}</td>
            <td>{{site.hostname}}</td>
            <td>{{site.created | format-date}}</td>
            <td class="setting-column">
                <active-site-setting-btn v-if="siteType === 'active'" :site="site"></active-site-setting-btn>
                <inactive-site-setting-btn v-if="siteType === 'inactive'" :site="site"></inactive-site-setting-btn>
            </td>
        </tr>
    `
});


/***/ }),

/***/ "./public/vue/sites/list/site_search_bar.js":
/*!**************************************************!*\
  !*** ./public/vue/sites/list/site_search_bar.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('site-search-bar', {
    created: function () {
        this.$bus.$on('update-site-list-type', (st) => this.handleSiteTypeChange(st));
    },
    data: function () {
        return {
            siteType: 'active',
            searchTerm: ''
        }
    },
    methods: {
        handleSiteTypeChange: function(siteType) {
            this.siteType = siteType;
            this.searchTerm = '';
        },
        search: function () {
            this.$bus.$emit('update-site-list', {siteType: this.siteType, searchTerm: this.searchTerm});
        }
    },
    template: `
        <div class="site-search-bar-row">
            <input class="form-control" @keyup.enter="search" v-model="searchTerm">
            <a class="btn btn-standard" @click="search">
                <span class="fa fw fa-search"></span>
            </a>
        </div>
    `
});


/***/ }),

/***/ "./public/vue/users/index.js":
/*!***********************************!*\
  !*** ./public/vue/users/index.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login */ "./public/vue/users/login.js");
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_login__WEBPACK_IMPORTED_MODULE_0__);



/***/ }),

/***/ "./public/vue/users/login.js":
/*!***********************************!*\
  !*** ./public/vue/users/login.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

Vue.component('loginForm', {
    data: function () {
        return {
            defaultGlobalErrorMessage: 'Sorry, an error occurred.  Please try again later.',
            username: '',
            usernameError: '',
            password: '',
            passwordError: '',
            globalError: ''
        }
    },
    props: ['postQuery'],
    methods: {
        login: function () {
            this.usernameError = this.username && this.username.length >= 2 ? '' : 'Username is not long enough';
            this.passwordError = this.password ? '' : 'Password is required';

            if(this.passwordError || this.usernameError) {
                return;
            }
            this.$http.post('/actions/kronos/login' + (this.postQuery || ''), {
                username: this.username,
                password: this.password
            }).then((result) => {
                let data = result.data || {};
                if(data.url) {
                    return window.location.href = result.data.url;
                }
                this.globalError = data.error || this.defaultGlobalErrorMessage;
            }).catch(() => {
                this.globalError = this.defaultGlobalErrorMessage;
            });
        }
    },
    template: `
        <div class="login-form">
            <span :if="globalError" class="error global-error"> {{globalError}}</span>
            <label>Username or email address</label>
            <input class="form-control input-field" :class="{'error': usernameError}" v-model="username" required>
            <span class="error">{{usernameError}}</span>
            <label>Password</label>
            <input class="form-control input-field" :class="{'error': passwordError}" type="password" v-model="password" required>
            <span :if="passwordError" class="error">{{passwordError}}</span>
            <button class="btn login-btn" v-on:click="login">Login</button>
        </div>
   `
});


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map