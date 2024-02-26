const contractModel = require('../model/contractModel');

// Create a new contract
async function createContract(req, res) {
    try {
        const contractData = req.body;
        const { attachments } = req.files
        const contractId = await contractModel.createContractWithAttachments(contractData, attachments, req.userid);
        res.status(201).json({ message: 'Contract created successfully', contractId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getContract(req, res) {
    try {
        const { id } = req.params
        console.log(id)
        const contracts = await contractModel.getContracts(id, req.userId);
        res.status(200).json(contracts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getContractPdf(req, res) {
    try {
        const { id } = req.params
        const baseUrl = req.protocol + '://' + req.get('host');

        const pdfdata = await contractModel.getContractsPdf(id, req.userId,baseUrl );

        if (!pdfdata) {
            res.status(404).send('Not Found');
            return
        }

        const pdfBuffer = Buffer.from(pdfdata, 'binary');

        // Set response headers for downloading the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=sample.pdf`);
        res.setHeader('responseType', `arraybuffer`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get contract by ID
async function getContractById(req, res) {
    try {
        const contractId = req.params.id;
        const contract = await contractModel.getContractById(contractId);
        res.json(contract);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update contract by ID
async function updateContractById(req, res) {
    try {
        const contractId = req.params.id;
        const contractData = req.body;
        await contractModel.updateContractById(contractId, contractData);
        res.json({ message: 'Contract updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete contract by ID
async function deleteContractById(req, res) {
    try {
        const contractId = req.params.id;
        await contractModel.deleteContractById(contractId);
        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createContract,
    getContractById,
    getContract,
    getContractPdf,
    updateContractById,
    deleteContractById,
};
