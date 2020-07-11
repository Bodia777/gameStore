const db = require('../config/db.config');

module.exports = {
    getGameDetails: async (req, res, next) => {
        try{
            const id = req.params.id;
            const connection = await db.get();
            const [[ gameDetails ]] = await connection.execute(`SELECT * FROM games WHERE GameID = '${id}'`);
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
                const [rows] = await connection.execute(`SELECT * FROM games WHERE Name LIKE BINARY '%${filter}%'`);
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
            const connection = await db.get();
            const game = req.body;
            const sql = `INSERT INTO games (Name, Description, Raiting) VALUE ('${game.name}', '${game.description}', '${game.raiting}')`;
            await connection.execute(sql);
            const result = await getGameID(game.name, res);
            res.status(201).json(result);
        } catch (err) {
            sendError(err, res);
        }
    },

    updateGame: async (req, res, next) => {
        try{
            const connection = await db.get();
            const gameId = req.params.id;
            const valueToChange = req.body;
            const query = `UPDATE games SET Name = '${valueToChange.name}', Description = '${valueToChange.description}', Raiting = '${valueToChange.raiting}' WHERE GameID = ${gameId}`;
            await connection.execute(query);
            res.status(200).json('game updated');
        } catch (err) {
            sendError(err, res);
        }
    },

    deleteGame: async (req, res, next) => {
        try{
            const connection = await db.get();
            const IDtoDelete = req.params;
            const query = `DELETE FROM games WHERE GameID = ${IDtoDelete.id};`;
            await connection.execute(query);
            res.status(204).json('game deleted');
        } catch(err) {
            sendError(err, res);
        }
    }
};

async function getGameID (gameName, res) {
    try{
        const connection = await db.get();
        const [[ gameId ]] = await connection.execute(`SELECT GameID FROM games WHERE Name = '${gameName}'`);
        return gameId;
    } catch(err) {
        sendError(err, res);
    }
};

function sendError(err, res) {
    if (err.errno = 1062) {
        res.status(403).json({
            message: `ERROR: ${err.sqlMessage}`
        });
    }
    console.log(err, 'error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    res.status(403).json({
        message: `ERROR: ${err}`
    });
}


