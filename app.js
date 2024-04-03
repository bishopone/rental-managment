const express = require('express');
const cors = require('cors');
const path = require('path');

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
const runDatabaseCronJob = require('./middleware/cronjob'); // Adjust the path as necessary
const fileUpload = require('express-fileupload');
const app = express();

app.use(cors())
// app.use(cors({
//     origin: "https://royalbusinesses.net"
// }
// ))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, './tmp'),
}));
app.use(bodyParser.json());
app.use('/api/uploads', express.static(__dirname + '/uploads'));
app.use('/api/user', usersRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/role', roleRoute);
app.use('/api/permission', permissionRoute);
app.use('/api/propertie', propertieRoute);
app.use('/api/room', roomRoute);
app.use('/api/room-types', roomTypeRoute);
app.use('/api/tenants', tenantsRoute);
app.use('/api/contracts', contractsRoute);
app.use('/api/payment', paymentRoute);



app.listen(5005, () => { console.log("connected") });
// app.listen();
