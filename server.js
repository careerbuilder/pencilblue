// server.js
const cluster = require('cluster'); // node builtin cluster
const Koa = require('koa');
const Storage = require('./storage_temp')();
let app = new Koa();

function log(msg) {
    let id = cluster.worker.id;
    console.log(`[${id}] ${msg}`)
}
app.use(async (ctx, next) => {
    log(`Starting request for ${ctx.req.url}`);
    await next();
    log('ending request');
});

app.use(async (ctx, next) => {
    ctx.myStore = new Storage();
    ctx.myStore.addData(ctx.query.data);
    log('added data to store');
    await next();
});
app.use(async (ctx) => {
    log('fetching data from store');
    ctx.body = ctx.myStore.getData();
    log(`There are currently ${ctx.myStore.testLength()} items in storage`);
});

app.listen(3000, () => {
    console.log(`Cluster worker ${cluster.worker.id} listening on ${3000}`)
});


