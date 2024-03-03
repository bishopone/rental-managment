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

async function getDashboardDetails(req, res) {
    try {
        const propertyId = req.query.id;
        var year = req.query.year;
        if (!year || year === 'null') {
            year = new Date().getFullYear(); 
        }
        console.log(year,propertyId);
        const dashboards = await dashboardModel.getDashboardDetails(propertyId,year);
        res.json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching room types. Please try again later.' });
    }
}
async function getDashboardDetailsChart(req, res) {
    try {
        const propertyId = req.query.id;
        var year = req.query.year;
        if (!year || year === 'null') {
            year = new Date().getFullYear(); 
        }
        console.log(year,propertyId);
        const dashboards = await dashboardModel.getDashboardDetailsChart(propertyId,year);
        res.json(dashboards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching room types. Please try again later.' });
    }
}

module.exports = {
    getAllDashboardData,
    getDashboardDetailsChart,
    getDashboardDetails
};