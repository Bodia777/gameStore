module.exports = {
    createGamesTable: async function () {
        const { connection } = this;
        try {
            const gameQuery = `
            CREATE TABLE IF NOT EXISTS games (game_id INTEGER UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT, 
                name VARCHAR(128) NOT NULL UNIQUE, 
                description TEXT NOT NULL, 
                raiting TINYINT UNSIGNED NOT NULL)`;
            await connection.execute(gameQuery);
        } catch (e) {
            throw new Error(`Couldn't create table games`);
        }
    }
}