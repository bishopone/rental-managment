const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');
const { checkTokenValidity } = require("../middleware/middleware");

router.get('/rooms-in-property',[checkTokenValidity], roomController.getAllRoomsInPropertys);
router.get('/:PropertyID/rooms', roomController.getAllRoomsInProperty);
router.get('/:roomID', roomController.getRoomById);
router.post('/:PropertyID/rooms', roomController.createRoom);
router.put('/:roomID', roomController.updateRoom);
router.delete('/:roomID', roomController.deleteRoom);

module.exports = router;
