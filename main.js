
const cluster = require('boring-cluster');
cluster(
    'server',
    { name: 'sweet server', workers: 2 }
);


