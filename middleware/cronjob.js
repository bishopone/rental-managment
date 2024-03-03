const cron = require('node-cron'); // Importing the node-cron library for scheduling tasks
const contractModel = require('../model/contractModel'); // Importing the contract model
const paymentModel = require('../model/paymentModel'); // Importing the payment model

console.info('Scheduler Started !!'); // Logging a message to indicate that the scheduler has started

const StartJob = async () => {
    try {
        const contracts = await contractModel.getContractsAll(); // Fetching all contracts
        await checkContractTimeLimit(contracts); // Checking contract time limits
        await checkSendSMSToNotify(contracts); // Sending SMS notifications
    } catch (error) {
        console.error('Error in StartJob:', error); // Logging any errors that occur during the job
    }
};

const checkContractTimeLimit = async (contracts) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const contract of contracts) {
        const contractEndDate = new Date(contract.ContractEndDate);
        contractEndDate.setHours(0, 0, 0, 0);
        if (contractEndDate < currentDate) {
            await contractModel.changeContractState(contract.ContractID, 'completed'); // Changing the contract state to 'completed' if the contract has expired
        }
    }
};

const checkSendSMSToNotify = async (contracts) => {
    const currentDate = new Date();
    const warningTime = 10; // Number of days before the due date to send a warning

    currentDate.setHours(0, 0, 0, 0);

    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + warningTime);

    for (const contract of contracts) {
        if (contract.ContractState === 'running') { // Checking if the contract is in the 'running' state
            const dueDate = contract.DueDate;
            const payment = await paymentModel.getPaymentByContractId(contract.ContractID); // Fetching payments for the contract
            const dueDateThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), dueDate);
            const isPaid = payment.find((pay) => {
                const payedMonth = new Date(pay.Month).getMonth();
                const payedYear = new Date(pay.Month).getFullYear();
                return payedMonth === dueDateThisMonth.getMonth() && payedYear === dueDateThisMonth.getFullYear() && pay.Status === "completed";
            });
            if (isPaid) {
                continue; // Skipping the contract if it has already been paid
            }
            dueDateThisMonth.setHours(0, 0, 0, 0);
            const differenceInDays = Math.ceil((dueDateThisMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

            if (differenceInDays === 0) {
                const todayRentWarning = `Hi ${contract.FirstName} ${contract.MiddleName} ${contract.LastName}, your rent payment of ${contract.Rent} ETB is due today. Please make the payment by the end of the day to avoid any late fees.`;
                console.log(todayRentWarning); // Sending a warning message for rent payment due today
            }
            if (differenceInDays <= warningTime && differenceInDays > 0) {
                const daysLeftWarning = `Hi ${contract.FirstName} ${contract.MiddleName} ${contract.LastName}, your rent payment of ${contract.Rent} ETB is due in ${differenceInDays} days. Please make the payment by the due date to avoid any late fees.`;
                console.log(daysLeftWarning); // Sending a warning message for rent payment due in the next few days
            }
            if (dueDateThisMonth < currentDate) {
                const interestWarning = `Hi ${contract.FirstName} ${contract.MiddleName} ${contract.LastName}, your rent payment of ${contract.Rent} ETB has passed. an interest of ${contract.Interest} ETB will be applied to your account daily.`;
                console.log(interestWarning); // Sending a warning message for overdue rent payment
            }
        }
    }
};

cron.schedule('*/30 * * * *', () => {
    console.log('running a task every 30 minutes');
    StartJob(); // Scheduling the StartJob function to run every 30 minutes
});
