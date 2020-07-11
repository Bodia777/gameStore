const express = require('express');
const logger = require('./logger');
const gameRouter = require('./routes/gameRouter');

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('', gameRouter);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status=404;
    next(error);
});

app.use((error, req, res, next) => {
 logger.error(error);
 res.status(error.status || 500);
 res.json({ error: {message: error.message} })
});

module.exports = app;