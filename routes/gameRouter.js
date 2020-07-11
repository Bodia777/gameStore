const express = require('express');

const { addGame, updateGame, deleteGame, getGames } =require('../controllers/game-controller');


const router = express.Router();
router.post('game/add', addGame);
router.post('game/:id/update', updateGame);
router.post('game/:id/delete', deleteGame);
router.get('games', getGames);

module.exports = router;