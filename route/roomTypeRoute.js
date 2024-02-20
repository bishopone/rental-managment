const express = require('express');
const router = express.Router();
const roomTypeController = require('../controller/roomTypeController');

router.get('/', roomTypeController.getAllRoomTypes);
router.post('/', roomTypeController.createRoomType);
router.put('/:roomTypeID', roomTypeController.updateRoomType);
router.delete('/:roomTypeID', roomTypeController.deleteRoomType);

module.exports = router;
