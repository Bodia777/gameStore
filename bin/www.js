const http = require('http');

const app = require('../app');
const db = require('../config/db.config');
const logger = require('../logger');

const server = http.createServer(app);
server.listen(3000, () => {
    logger.info(`
=================Server====================
           host : localhost
           port : 3000
===========================================
    `)
});


try{
    db.connect();
} catch(e) {
    logger.error(e);
}