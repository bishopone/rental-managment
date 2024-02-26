const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');
const { checkTokenValidity,checkUserPermission } = require("../middleware/middleware");

router.get('/',[checkTokenValidity], dashboardController.getAllDashboardData);


module.exports = router;
