const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');

router.post('/:propertyID/rooms', roomController.createRoom);
router.put('/rooms/:roomID', roomController.updateRoom);
router.delete('/rooms/:roomID', roomController.deleteRoom);

module.exports = router;
