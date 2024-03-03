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
        console.log(previousRows);
        // Get data for the current date
        const currentQuery = `
        SELECT 
        up.PropertyID,
        COALESCE(SUM(p.Amount), 0) AS CurrentTotal,
        MAX(p.PaymentDate) AS LatestPaymentDate,
        r.AvailableRooms,
        c.Contracts,
        c.RentAmount
    FROM 
        userproperty up
    JOIN 
        (SELECT 
             PropertyID, 
             COUNT(RoomID) AS AvailableRooms
         FROM 
             rooms
         WHERE 
             Status = 'Available'
         GROUP BY 
             PropertyID) r ON r.PropertyID = up.PropertyID
    LEFT JOIN 
        (SELECT 
         ContractID,
             PropertyID, 
             COUNT(ContractID) AS Contracts,
             SUM(Rent) AS RentAmount
         FROM 
             contracts
         WHERE 
             ContractState = 'running'
         GROUP BY 
             PropertyID) c ON c.PropertyID = up.PropertyID
    LEFT JOIN 
        payments p ON p.ContractID = c.ContractID AND DATE(p.PaymentDate) = CURRENT_DATE
    WHERE 
        up.UserID = ?
    GROUP BY 
        up.PropertyID;
    `;

        const [currentRows] = await db.promise().query(currentQuery, [userId]);
        const dashboardData = currentRows.map((currentRow, index) => {
            const previousRow = previousRows[index];
            const currentTotal = parseFloat(currentRow?.CurrentTotal || 0);
            const previousTotal = parseFloat(previousRow?.PreviousTotal || 0);
            if (previousRow && previousTotal !== 0) {
                const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
                return {
                    PropertyID: currentRow.PropertyID,
                    CurrentTotal: currentTotal,
                    LatestPaymentDate: currentRow.LatestPaymentDate,
                    Contracts: currentRow?.Contracts || 0,
                    RentAmount: currentRow?.RentAmount || 0,
                    AvailableRooms: currentRow?.AvailableRooms || 0,
                    PercentageChange: percentageChange
                };
            } else {
                return {
                    PropertyID: currentRow.PropertyID,
                    CurrentTotal: parseFloat(currentRow.CurrentTotal),
                    LatestPaymentDate: currentRow.LatestPaymentDate,
                    Contracts: currentRow?.Contracts || 0,
                    RentAmount: currentRow?.RentAmount || 0,
                    AvailableRooms: currentRow?.AvailableRooms || 0,
                    PercentageChange: 0
                };
            }
        });

        return dashboardData;
    } catch (error) {
        throw error;
    }
}

async function getDashboardDetails(propertyId, year) {
    try {
        // Initialize sales data array with zeroes for each month
        const salesData = Array(12).fill(0);

        // Get data for the specified year
        const previousDateQuery = `
        SELECT
        c.ContractID,
        p2.YearTotal,
        DATE_FORMAT(p.Month, '%c') AS PaymentMonth,
        SUM(p.Amount) AS TotalPayment,
        COUNT(t.TenantID) AS Tenants
    FROM
        contracts c
    JOIN payments p ON
        c.ContractID = p.ContractID
    JOIN(
        SELECT
            ContractID,
            p2.Amount AS YearTotal
        FROM
            payments p2
    ) p2
    ON
        c.ContractID = p2.ContractID AND c.PropertyID = :id AND DATE_FORMAT(p.Month, '%Y') = :year
    JOIN tenants t ON
        t.TenantID = c.TenantID
    WHERE
        c.PropertyID = :id AND DATE_FORMAT(p.Month, '%Y') = :year
    GROUP BY
        DATE_FORMAT(p.Month, '%c');`;

        const [previousRows] = await db.promise().query(previousDateQuery, { id: propertyId, year: year });
        console.log(previousRows);
        // Process the data into the desired format
        previousRows.forEach(row => {
            const monthIndex = parseInt(row.PaymentMonth) - 1; // Convert month to zero-based index
            salesData[monthIndex] = parseFloat(row.TotalPayment); // Set sales data for the month
        });
        var Tenants = 0
        previousRows.forEach(row => {
            Tenants = parseInt(row.Tenants) + Tenants; // Convert month to zero-based index
        });

        // Map months to their names
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Prepare chart data object
        const chartData = {
            labels: months,
            datasets: { label: "Sales", data: salesData }
        };

        const itemsData = [
            {
                icon: { color: "primary", component: "person" },
                label: "tenants",
                progress: { content: `${Tenants}`, percentage: 100 },
            },
       
        ]

        return { chart: chartData, items: itemsData };
    } catch (error) {
        throw error;
    }
}

async function getDashboardDetailsChart(propertyId, year) {
    try {
        const actualPaymentDataQuery = `
            SELECT
                EXTRACT(YEAR FROM p.PaymentDate) AS payment_year,
                EXTRACT(MONTH FROM p.PaymentDate) AS payment_month,
                SUM(p.Amount) AS total_payments
            FROM
                contracts c
            JOIN payments p ON
                c.ContractID = p.ContractID
            WHERE
                EXTRACT(YEAR FROM p.PaymentDate) = :year AND c.PropertyID = :id AND c.ContractState = "running"
            GROUP BY
                EXTRACT(YEAR FROM p.PaymentDate),
                EXTRACT(MONTH FROM p.PaymentDate)
            ORDER BY
                payment_year,
                payment_month;`;

        const expectedPaymentDataQuery = `
            SELECT
                EXTRACT(YEAR FROM p.Month) AS payment_year,
                EXTRACT(MONTH FROM p.Month) AS payment_month,
                SUM(p.Amount) AS total_payments
            FROM
                contracts c
            JOIN payments p ON
                c.ContractID = p.ContractID
            WHERE
                EXTRACT(YEAR FROM p.Month) = :year AND c.PropertyID = :id AND c.ContractState = "running"
            GROUP BY
                EXTRACT(YEAR FROM p.Month),
                EXTRACT(MONTH FROM p.Month)
            ORDER BY
                payment_year,
                payment_month;`;
        const [actualPaymentData] = await db.promise().query(actualPaymentDataQuery, { id: propertyId, year: year });
        const [expectedPaymentData] = await db.promise().query(expectedPaymentDataQuery, { id: propertyId, year: year });
        console.log(expectedPaymentData);

        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const actualPayments = Array.from({ length: 12 }).fill(0);
        const expectedPayments = Array.from({ length: 12 }).fill(0);
        actualPaymentData.forEach(row => {
            const paymentMonth = parseInt(row.payment_month);
            const paymentAmount = parseFloat(row.total_payments);
            actualPayments[paymentMonth - 1] = paymentAmount; 
        });
        expectedPaymentData.forEach(row => {
            const paymentMonth = parseInt(row.payment_month);
            const paymentAmount = parseFloat(row.total_payments);
            console.log(paymentMonth-1);
            expectedPayments[paymentMonth - 1] = paymentAmount; 
        });

        const chartData = {
            labels: labels, 
            datasets: [
                {
                    label: "Actual Payment Date",
                    color: "success",
                    data: actualPayments, 
                },
                {
                    label: "Recived Payment",
                    color: "info",
                    data: expectedPayments, 
                },
            ],
        };

        return chartData;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getAllDashboardData,
    getDashboardDetails,
    getDashboardDetailsChart
};
