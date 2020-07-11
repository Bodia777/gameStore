const winston = require('winston');
require('winston-daily-rotate-file');

const options = {
    infoFiles: new (winston.transports.DailyRotateFile)({
        filename: './log/info/info-%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        format: winston.format.json(),
        zippedArchive: true,
        prepend: true,
        handleExceptions: true,
        level: 'info',
        maxSize: '5m',
        maxFiles: '10'
    }),
    errFiles: new (winston.transports.DailyRotateFile)({
        filename: './log/err/err-%DATE%.log',
        datePattern: 'DD-MM-YYYY',
        format: winston.format.json(),
        zippedArchive: true,
        prepend: true,
        handleExceptions: true,
        level: 'error',
        maxSize: '5m',
        maxFiles: '10'
    }),
    console: new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }),
};

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [options.console , options.errFiles, options.infoFiles],
    exitOnError: false
});


// logger.stream = {
//     write: function(message) {
//         logger.info(message);
//     },
// };

module.exports = logger;