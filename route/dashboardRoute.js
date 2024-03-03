const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');
const { checkTokenValidity,checkUserPermission } = require("../middleware/middleware");

router.get('/',[checkTokenValidity], dashboardController.getAllDashboardData);
router.get('/detail/bar-chart',[checkTokenValidity], dashboardController.getDashboardDetails);
router.get('/detail/line-chart',[checkTokenValidity], dashboardController.getDashboardDetailsChart);


module.exports = router;
