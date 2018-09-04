/*
    Copyright (C) 2016  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict'
//dependencies
const cluster = require('cluster');
const winston = require('winston');
let newrelic = null;

if(process.env.NEW_RELIC_LICENSE_KEY && process.env.NEW_RELIC_APP_NAME){
  newrelic = require('newrelic');
}



module.exports = function LogFactory(pb){

    function configureFileTransport(config) {
        //when a log file path is provided log to a file
        if (pb.util.isString(config.logging.file)) {

            //ensure the directory structure exists
            pb.util.mkdirsSync(config.logging.file, true);

            //add the transport
            let fileTransport = new (winston.transports.File)(getFileTransportContext());
            config.logging.transports.push(fileTransport);
        }
    }

    function getConsoleTransport(config) {
        return new (winston.transports.Console)({
            level: config.logging.level,
            timestamp: true,
            label: cluster.worker ? cluster.worker.id : 'M'
        });
    }

    function getFileTransportContext(config) {
        return {filename: config.logging.file, level: config.logging.level, timestamp: true};
    }
    function getLoggingContext (config) {
        return {
            transports: config.logging.transports,
            level: config.logging.level,
            padLevels: false
        }
    }

    function setupLoggingContext () {
        //verify that we have a valid logging configuration provided
        pb.config.logging = pb.config.logging || {};
        if (!pb.util.isString(pb.config.logging.level)) {
            pb.config.logging.level = 'info';
        }
        if (!pb.util.isArray(pb.config.logging.transports)) {
            //initialize transports with console by default
            pb.config.logging.transports = [getConsoleTransport(config)];
            configureFileTransport(config);
        }
    }



    class PencilBlueLogger extends winston.Logger {
        constructor(context) {
            super(context);
        }

        isDebug () {
            return this.levels[this.level] >= this.levels.debug;
        }
        isSilly () {
            return this.levels[this.level] >= this.levels.silly;
        }
        
        setTransactionName (routeName) {
            newrelic ? newrelic.setTransactionName(routeName) : '';
        }

        error (message) {
            newrelic ? newrelic.noticeError(message) : '';
            super.error(message);
        }
    }

    setupLoggingContext();
    const logger = new PencilBlueLogger(getLoggingContext(config));

    //return the configured logger instance
    logger.info(`SystemStartup: Log Level is: ${pb.config.logging.level}`);
    return logger;
};

