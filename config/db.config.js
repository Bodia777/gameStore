const mysql = require('mysql2/promise');
const { createGamesTable } = require('./tableDBGenerator');
const logger = require('../logger');

const dbConf = {
    host: 'localhost',
    user: 'root',
    password: 'LV123!',
    database: 'gamestore',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  const state = { pool: null };

const createDB = async function (connection, database) {
    const query = `CREATE DATABASE IF NOT EXISTS ${database};`;
    try {
        await connection.execute(query);
        logger.info(`Created DB ${database}`);
    } catch (e) {
        throw new Error(e, `couldn't create db.`);
    }
};

const updateConnection = async function() {
    state.pool = await mysql.createPool(dbConf);
    await state.pool.getConnection().then(conf => {
        logger.info(`
================Database===================
        name :  ${conf.config.database}
        host :  ${conf.config.host}
        port :  ${conf.config.port}
===========================================`);
    });
};

const connect = async function (numberofTrials = 2) {
    if (numberofTrials === 0)
        throw new Error('Missing database connection.');
    try {
        state.pool = await mysql.createPool({
            host: dbConf.host,
            user: dbConf.user,
            password: dbConf.password
        });

        await createDB(state.pool, dbConf.database);
        await updateConnection();
        await createGamesTable.call({ connection: state.pool });
    } catch (e) {
        await connect(numberofTrials - 1);
    }
};

const get = function () {
    const pool = state.pool;
    if (!pool) throw new Error('Missing database connection.');
    return pool;
};

module.exports = { get, connect };
