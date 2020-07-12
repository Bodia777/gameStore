const logger = require('../logger');
const { getGame, getGames, postGame, patchGame, delGame, getId } = require('../service/game-service');

module.exports = {
    getGameDetails: async (req, res, next) => {
        try{
            const id = req.params.id;
            const gameDetails = await checkId(id, res);
            if (gameDetails) res.status(200).json(gameDetails);
        } catch (err) {
            sendError(err, res);
        }
    },

    getGames: async (req, res, next) => {
        try {
            let filter = null;
            if ((req.query).hasOwnProperty('filter')) {
                    filter = req.query.filter;
            }
            const games = await getGames(filter);
            res.status(200).json(games);
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
            if(requiredField.length) {
                res.status(403).json({status: 'failed', message: `required field ${requiredField.join(', ')}`});
            } else {
                await postGame(name, description, raiting);
                const result = await getGameID(name, res);
                res.status(201).json({status: 'success', id: result});
            }
        } catch (err) {
            sendError(err, res);
        }
    },

    updateGame: async (req, res, next) => {
        try{
            const gameId = +req.params.id;
            const checkGameId = await checkId(gameId, res);
            const dataForUpdate = req.body;
            if (checkGameId) {
                await patchGame(dataForUpdate, gameId);
                res.status(200).json({status: 'success', message: 'game updated'});
            }
        } catch (err) {
            sendError(err, res);
        }
    },

    deleteGame: async (req, res, next) => {
        try{
            const iDtoDelete = req.params.id;
            const checkGameId = await checkId(iDtoDelete, res);
            if (checkGameId) {
                await delGame(iDtoDelete);
// I can use status 204 too, without response.body entity 
                res.status(200).json({status: 'success', message: 'game deleted'});
            }
        } catch(err) {
            sendError(err, res);
        }
    }
};

async function getGameID (gameName, res) {
    try{
        const gameId = await getId(gameName);
        if (!gameId) {
            res.status(403).json({status: 'failure', message: 'uncknown game Name'})
        } else {
            return gameId;
        }
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
};

async function checkId(id, res) {
    const gameDetails = await getGame(id);
    if (!gameDetails) {
        res.status(403).json({status: 'failure', message: 'uncknown game Id'})
    } else {
        return gameDetails;
    };
}


