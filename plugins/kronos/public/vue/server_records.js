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
