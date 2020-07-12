const db = require('../config/db.config');

module.exports = {
    getGame: async (id) => {
        const connection = await db.get();
        const [[ gameDetails ]] = await connection.execute(`SELECT * FROM games WHERE game_id = '${id}'`);
        return gameDetails;
    },
    getGames: async (filter) => {
        const connection = await db.get();
        if (filter) {
            const [games] = await connection.execute(`SELECT * FROM games WHERE name LIKE '%${filter}%'`)
            return games;
        } else {
            const [games] = await connection.execute(`SELECT * FROM games`);
            return games;
        } ;
    },
    postGame: async (name, description, raiting) => {
        const connection = await db.get();
        const query = `INSERT INTO games (name, description, raiting) VALUE ('${name}', '${description}', '${raiting}')`;
        await connection.execute(query);
    },
    patchGame: async (dataForUpdate, gameId) => {
        const values = [];
        for (let key in dataForUpdate) {
            values.push(`${key} = '${ dataForUpdate[key] }'`)
        }
        const connection = await db.get();
        const query = `UPDATE games SET ${values.join(',')} WHERE game_id = ${gameId}`;
        await connection.execute(query);
    },
    delGame: async (id) => {
        const connection = await db.get();
        const query = `DELETE FROM games WHERE game_id = ${id};`;
        await connection.execute(query);
    },
    getId: async (gameName) => {
        const connection = await db.get();
        const [[ gameId ]] = await connection.execute(`SELECT game_id FROM games WHERE name = '${gameName}'`);
        return gameId;
    }
}