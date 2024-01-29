const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./route/usersRoute');
const roleRoute = require('./route/roleRoute');
const permissionRoute = require('./route/permissionRoute');
const propertieRoute = require('./route/propertieRoute');
const fileUpload = require('express-fileupload');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(fileUpload());
app.use('/api/v1/uploads', express.static(__dirname + '/uploads'));
app.use(bodyParser.json());
app.use('/api/v1/user', usersRoute);
app.use('/api/v1/role', roleRoute);
app.use('/api/v1/permission', permissionRoute);
app.use('/api/v1/properties', propertieRoute);

app.listen(5000, () => { console.log("connected") });
// app.listen();
