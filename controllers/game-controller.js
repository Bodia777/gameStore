const logger = require('../logger');
const { getGame, getGames, postGame, patchGame, delGame, getId } = require('../service/game-service');

module.exports = {
    getGameDetails: async (req, res, next) => {
        try{
            const id = req.params.id;
            const gameDetails = await getGame(id);
            if (!gameDetails) res.status(403).json('not found');
            res.status(200).json(gameDetails);
        } catch (err) {
            sendError(err, res);
        }
    },

    getGames: async (req, res, next) => {
        try {
            if ((req.query).hasOwnProperty('filter')) {
                const filter = req.query.filter;
                const games = await getGames(filter);
                res.status(200).json(games);
            } else {
                const games = await getGames();
                res.status(200).json(games);
            }
        } catch (err) {
            sendError(err, res);
        }
    },

    addGame: async (req, res, next) => {
        try {
            const requiredField = [];
            let { name, description, raiting } = req.body;
            if (!name)  requiredField.push('name');
            if(!description) requiredField.push('description');
            if(!raiting) requiredField.push('raiting');
            if(requiredField.length) res.status(403).json({status: 'failed', message: `required field ${requiredField.join(', ')}`});
            await postGame(name, description, raiting);
            const result = await getGameID(game.name, res);
            res.status(201).json({status: 'success', id: result});
        } catch (err) {
            sendError(err, res);
        }
    },

    updateGame: async (req, res, next) => {
        try{
            const gameId = req.params.id;
            const { name, description, raiting } = req.body;
            await patchGame(name, description, raiting, gameId);
            res.status(200).json({status: 'success', message: 'game updated'});
        } catch (err) {
            sendError(err, res);
        }
    },

    deleteGame: async (req, res, next) => {
        try{
            const iDtoDelete = req.params.id;
            await delGame(iDtoDelete);
            res.status(204).json({status: 'success', message: 'game deleted'});
        } catch(err) {
            sendError(err, res);
        }
    }
};

async function getGameID (gameName, res) {
    try{
        const gameId = await getId(gameName);
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


