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
