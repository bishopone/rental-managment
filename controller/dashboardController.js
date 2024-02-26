const dashboardModel = require('../model/dashboardModel');


async function getAllDashboardData(req, res) {
    try {
        const dashboards = await dashboardModel.getAllDashboardData(req.userId);
        res.json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching room types. Please try again later.' });
    }
}

module.exports = {
    getAllDashboardData,
};