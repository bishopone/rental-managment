const db = require('../config/dbConfig');

async function getAllDashboardData(userId) {
    try {
        // Get data for the previous date
        const previousDateQuery = `
            SELECT 
                up.PropertyID,
                COALESCE(SUM(p.Amount), 0) AS PreviousTotal
            FROM 
                userproperty up
            JOIN 
                contracts c ON up.PropertyID = c.PropertyID
            LEFT JOIN 
                payments p ON c.ContractID = p.ContractID 
                    AND DATE(p.PaymentDate) = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
            WHERE 
                up.UserID = ?
            GROUP BY 
                up.PropertyID;`;

        const [previousRows] = await db.promise().query(previousDateQuery, [userId]);

        // Get data for the current date
        const currentQuery = `
        SELECT 
        up.PropertyID,
        SUM(p.Amount) AS CurrentTotal,
        MAX(p.PaymentDate) AS LatestPaymentDate,
        COUNT(c.ContractID) AS Contracts,
        SUM(c.Rent) AS RentAmount,
        COUNT(r.RoomID) AS AvailableRooms
    FROM 
        userproperty up
    JOIN 
        contracts c ON up.PropertyID = c.PropertyID
    JOIN 
        rooms r ON r.PropertyID = up.PropertyID AND r.Status = 'Available'
    JOIN 
        payments p ON c.ContractID = p.ContractID
    WHERE 
        up.UserID = ?
        AND DATE(p.PaymentDate) = CURRENT_DATE
    GROUP BY 
        up.PropertyID;`;

        const [currentRows] = await db.promise().query(currentQuery, [userId]);
        const dashboardData = currentRows.map((currentRow, index) => {
            const previousRow = previousRows[index];
            const currentTotal = parseFloat(currentRow.CurrentTotal);
            const previousTotal = parseFloat(previousRow.PreviousTotal);
            if (previousRow && previousTotal !== 0) {
                const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
                return {
                    PropertyID: currentRow.PropertyID,
                    CurrentTotal: currentTotal,
                    LatestPaymentDate: currentRow.LatestPaymentDate,
                    Contracts: currentRow.Contracts,
                    RentAmount: currentRow.RentAmount,
                    AvailableRooms: currentRow.AvailableRooms,
                    PercentageChange: percentageChange
                };
            } else {
                return {
                    PropertyID: currentRow.PropertyID,
                    CurrentTotal: parseFloat(currentRow.CurrentTotal),
                    LatestPaymentDate: currentRow.LatestPaymentDate,
                    Contracts: currentRow.Contracts,
                    RentAmount: currentRow.RentAmount,
                    AvailableRooms: currentRow.AvailableRooms,
                    PercentageChange: 0 // or any default value you choose
                };
            }
        });

        return dashboardData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllDashboardData,
};
