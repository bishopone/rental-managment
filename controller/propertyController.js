const propertyModel = require('../model/propertyModel');
const fs = require('fs');
const path = require('path');

async function getAllProperties(req, res) {
    try {
        const properties = await propertyModel.getAllProperties();
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching properties. Please try again later.' });
    }
}


async function getAllPropertiesWithAuthority(req, res) {
    try {
        const properties = await propertyModel.getAllPropertiesWithAuthority(req.userId);
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching properties. Please try again later.' });
    }
}
async function getPropertyDetailById(req, res) {
    try {
        const propertyId = req.params.id;
        const properties = await propertyModel.getPropertyDetailById(propertyId);
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching properties. Please try again later.' });
    }
}

async function getPropertyById(req, res) {
    const propertyId = req.params.id;
    try {
        const property = await propertyModel.getPropertyById(propertyId);
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
        } else {
            res.json(property);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching the property. Please try again later.' });
    }
}


async function createProperty(req, res) {

    try {
        const { owner, name, location, description, numFloors } = req.body;
        console.log(image)
        const { image } = req.files; // Assuming 'image' is the name of the file input field
        console.log(image)
        // Check if all required fields are present and non-empty
        if (!owner || !name || !location || !description || !image || !numFloors) {

            res.status(400).json({ error: 'All fields are required.' });
            return;
        }

        // Check if 'image' is present and is indeed a file
        if (!image[0] || !image[0].name || !image[0].mimetype || !image[0].data) {

            res.status(400).json({ error: 'Image file is missing.' });
            return;
        }

        // Create the 'properties' directory if it doesn't exist
        const propertiesDir = path.join('./uploads/properties');
        if (!fs.existsSync(propertiesDir)) {
            fs.mkdirSync(propertiesDir);
        }

        // Save the uploaded image to the 'properties' directory
        const imagePath = path.join(propertiesDir, image[0].name);
        image[0].mv(imagePath, async (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to upload image.' });
                return;
            }

            // Image uploaded successfully, proceed to create property in the database
            const result = await propertyModel.createProperty(owner, name, location, description, imagePath, numFloors);
            res.status(201).json({ message: 'Property created', propertyId: result.insertId });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while creating the property. Please try again later.' });
    }
}


async function updateProperty(req, res) {
    const propertyId = req.params.id;
    const property = req.body;
    try {
        const result = await propertyModel.updateProperty(property, propertyId);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Property not found' });
        } else {
            res.status(200).json({ message: 'Property updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while updating the property. Please try again later.' });
    }
}

async function deleteProperty(req, res) {
    const propertyId = req.params.id;
    try {
        const result = await propertyModel.deleteProperty(propertyId);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Property not found' });
        } else {
            res.status(200).json({ message: 'Property deleted', propertyId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while deleting the property. Please try again later.' });
    }
}
async function connectUserToProperty(req, res) {
    const { userId, propertyId } = req.body;

    try {
        await propertyModel.connectUserToProperty(userId, propertyId);
        res.status(200).json({ message: 'User connected to property successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeUserFromProperty(req, res) {
    const { userId, propertyId } = req.params;
    console.log(userId, propertyId)
    try {
        await propertyModel.removeUserFromProperty(userId, propertyId);
        res.status(200).json({ message: 'User removed from property successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllProperties,
    getAllPropertiesWithAuthority,
    getPropertyById,
    getPropertyDetailById,
    createProperty,
    updateProperty,
    deleteProperty,
    connectUserToProperty,
    removeUserFromProperty
};
