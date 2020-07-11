const mysql = require('mysql2/promise');
const { createGamesTable, createCardsTable } = require('./tableDBGenerator');

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
        console.log(`Created DB ${database}`)
    } catch (e) {
        throw new Error(e, `couldn't create db.`);
    }
};

const updateConnection = async function() {
    state.pool = await mysql.createPool(dbConf);
    await state.pool.getConnection().then(conf => {
        console.log('================Database===================');
        console.log(' name : ' + conf.config.database);
        console.log(' host : ' + conf.config.host);
        console.log(' port : ' + conf.config.port);
        console.log('===========================================');
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
        // await createCardsTable.call({ connection: state.pool });
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
