module.exports = {
    createGamesTable: async function () {
        const { connection } = this;
        try {
            const gameQuery = `
            CREATE TABLE IF NOT EXISTS games (GameID INTEGER UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT, 
                Name VARCHAR(128) NOT NULL UNIQUE, 
                Description TEXT NOT NULL, 
                Raiting TINYINT UNSIGNED NOT NULL)`;
            await connection.execute(gameQuery);
        } catch (e) {
            throw new Error(`Couldn't create table games`);
        }
    },
    createCardsTable: async function () {
        const { connection } = this;
        try {
            const cardsQuery = `
            CREATE TABLE IF NOT EXISTS cards (CardID INTEGER UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT, 
                USER_CARD_ID INTEGER NOT NULL,
                CardNumber VARCHAR(19) NOT NULL UNIQUE,
                CardDate VARCHAR(5) NOT NULL,
                FOREIGN KEY (USER_CARD_ID) REFERENCES users(UserID) ON DELETE CASCADE)`;
            await connection.execute(cardsQuery);
        } catch (e) {
        throw new Error(`Couldn't create table cards`);
        }
    }
}