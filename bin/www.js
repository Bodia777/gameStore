const http = require('http');

const app = require('../app');
const db = require('../config/db.config')

// app.set('port', 3000);

const server = http.createServer(app);
server.listen(3000, () => {
    console.log(`
    ================Server=================
      host : localhost
      port : 3000
    =======================================
    `)
});


try{
    db.connect();
} catch(e) {
    console.log(e, 'ERROR<<<<<<DB<<<CONNECTION<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
}