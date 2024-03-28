const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./route/usersRoute');
const roleRoute = require('./route/roleRoute');
const permissionRoute = require('./route/permissionRoute');
const propertieRoute = require('./route/propertieRoute');
const roomRoute = require('./route/roomRoute');
const roomTypeRoute = require('./route/roomTypeRoute');
const tenantsRoute = require('./route/tenantsRoute');
const contractsRoute = require('./route/contractRoutes');
const paymentRoute = require('./route/paymentRoute');
const dashboardRoute = require('./route/dashboardRoute');
const fileUpload = require('express-fileupload');
const runDatabaseCronJob = require('./middleware/cronjob'); // Adjust the path as necessary
const corsOption = require('./config/corsOption'); // Adjust the path as necessary
const cors = require('cors');
const app = express();

app.use(cors(corsOption));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://www.royalbusinesses.net");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, Delete");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
app.options('*', cors());
app.use(fileUpload());
app.use(bodyParser.json({limit: '50mb'}));

app.use('/api/v1/uploads', express.static(__dirname + '/uploads'));
app.use('/api/v1/user', usersRoute);    
app.use('/api/v1/dashboard', dashboardRoute);    
app.use('/api/v1/role', roleRoute);
app.use('/api/v1/permission', permissionRoute);
app.use('/api/v1/propertie', propertieRoute);
app.use('/api/v1/room', roomRoute);
app.use('/api/v1/room-types', roomTypeRoute);
app.use('/api/v1/tenants', tenantsRoute);
app.use('/api/v1/contracts', contractsRoute);
app.use('/api/v1/payment', paymentRoute);



// app.listen(5000, () => { console.log("connected") });
app.listen();
