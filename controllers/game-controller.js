const db = require('../config/db.config');
const logger = require('../logger');

module.exports = {
    getGameDetails: async (req, res, next) => {
        try{
            const id = req.params.id;
            const connection = await db.get();
            const [[ gameDetails ]] = await connection.execute(`SELECT * FROM games WHERE game_id = '${id}'`);
            if (!gameDetails) res.status(403).json('not found');
            res.status(200).json(gameDetails);
        } catch (err) {
            sendError(err, res);
        }
    },
    getGames: async (req, res, next) => {
        try {
            if (Object.entries(req.query).length) {
                const connection = await db.get();
                const filter = req.query.filter;
                const [rows] = await connection.execute(`SELECT * FROM games WHERE name LIKE '%${filter}%'`);
                res.status(200).json(rows);
            } else {
                const connection = await db.get();
                const [rows] = await connection.execute(`SELECT * FROM games`);
                res.status(200).json(rows);
            }
        } catch (err) {
            sendError(err, res);
        }
    },

    addGame: async (req, res, next) => {
        try {
            const requiredField = [];
            const connection = await db.get();
            let { name, description, raiting } = req.body;
            if (!name)  requiredField.push('name');
            if(!description) requiredField.push('description');
            if(!raiting) requiredField.push('raiting');
            if(requiredField.length) res.status(403).json({status: 'failed', message: `required field ${requiredField.join(', ')}`});

            const sql = `INSERT INTO games (name, description, raiting) VALUE ('${name}', '${description}', '${raiting}')`;
            await connection.execute(sql);
            const result = await getGameID(game.name, res);
            res.status(201).json({status: 'success', id: result});
        } catch (err) {
            sendError(err, res);
        }
    },

    updateGame: async (req, res, next) => {
        try{
            const connection = await db.get();
            const gameId = req.params.id;
            const { name, description, raiting } = req.body;

            const query = `UPDATE games SET
            name = '${name}', description = '${description}', raiting = '${raiting}'
            WHERE game_id = ${gameId}`;

            await connection.execute(query);
            res.status(200).json({status: 'success', message: 'game updated'});
        } catch (err) {
            sendError(err, res);
        }
    },

    deleteGame: async (req, res, next) => {
        try{
            const connection = await db.get();
            const IDtoDelete = req.params;
            const query = `DELETE FROM games WHERE game_id = ${IDtoDelete.id};`;
            await connection.execute(query);
            res.status(204).json({status: 'success', message: 'game deleted'});
        } catch(err) {
            sendError(err, res);
        }
    }
};

async function getGameID (gameName, res) {
    try{
        const connection = await db.get();
        const [[ gameId ]] = await connection.execute(`SELECT game_id FROM games WHERE name = '${gameName}'`);
        return gameId;
    } catch(err) {
        sendError(err, res);
    }
};

function sendError(err, res) {
    logger.error(err);
    if (err.errno = 1062) {
        res.status(403).json({
            message: `ERROR: ${err.sqlMessage}`
        });
    }
    res.status(403).json({
        message: `ERROR: ${err}`
    });
}


