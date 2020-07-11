const express = require('express');

const gameRouter = require('./routes/gameRouter');


let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/', gameRouter);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status=404;
    console.log('error 404');
    error.message = 'wrong href';
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error, 'ERROR<<<<<');
 res.status(error.status || 500);
 res.json({
     error: {message: error.message}
    })
});

module.exports = app;