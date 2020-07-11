const db = require('../config/db.config');

module.exports = {
    getGames: async (req, res, next) => {
        try {
            if (req.query) {
                const filter = req.query;

            } else {
                const connection = await db.get();
                const [rows] = await connection.execute(`SELECT * FROM games WHERE Name LIKE BINARY '%${filter}%'`);
                console.log(rows, 'rows');
                res.send('get works');
            }
        } catch (err) {
            console.log(err, 'error<<<<<<<<<<');
            throw err;
        }
    },

    addGame: async (req, res, next) => {
        try {
            const connection = await db.get();
            const game = req.body;
            const sql = `INSERT INTO games (Name, Description, Raiting) VALUE ('${game.name}', '${game.description}', '${game.raiting}')`;
            await connection.execute(sql);
            const result = await getGameID(game.name);
            res.status(201).json(result);
        } catch (err) {
            if (err.errno = 1062) {
                res.status(403).json({
                    message: `ERROR: ${err.sqlMessage}`
                });
            }
            console.log(err.sqlMessage, err.errno, 'error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        }
    },

    updateGame: async (req, res, next) => {
        const connection = await db.get();
        const gameId = req.params;
        const valueToChange = req.body;
        const query = `UPDATE games SET Name = '${valueToChange.name}', Description = '${valueToChange.description}', Raiting = '${valueToChange.raiting}' WHERE GameID = ${gameId.id}`;
        await connection.execute(query);
        res.status(200).json('game updated');
    },

    deleteGame: async (req, res, next) => {
        const connection = await db.get();
        const IDtoDelete = req.params;
        const query = `DELETE FROM games WHERE GameID = ${IDtoDelete.id};`;
        await connection.execute(query);
        res.status(204).json('game deleted');
    }
};

async function getGameID (gameName) {
    try{
        const connection = await db.get();
        const [[ gameId ]] = await connection.execute(`SELECT GameID FROM games WHERE Name = '${gameName}'`);
        return gameId;
    } catch(e) {
        console.log(e , 'Error in getGameId');
    }
}

