const express = require('express');
const { addGame, updateGame, deleteGame, getGames, getGameDetails } = require('../controllers/game-controller');


const router = express.Router();
router.post('/game/add', addGame);
router.post('/game/:id/update', updateGame);
router.post('/game/:id/delete', deleteGame);
router.get('/games', getGames);
router.get('/game/:id', getGameDetails);

module.exports = router;