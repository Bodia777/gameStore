const express = require('express');
const { addGame, updateGame, deleteGame, getGames, getGameDetails } = require('../controllers/game-controller');


const router = express.Router();
// I prefer to use post request method and url '/games' when I have to add new object 
router.post('/game/add', addGame);
// I prefer to use patch request method and url '/games/{id}' when I have to change some object 
router.post('/game/:id/update', updateGame);
// I prefer to use delete request method and url '/games/{id}' when I have to delete some object 
router.post('/game/:id/delete', deleteGame);
router.get('/games', getGames);
router.get('/game/:id', getGameDetails);

module.exports = router;