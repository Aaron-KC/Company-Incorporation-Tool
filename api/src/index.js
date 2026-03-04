const express = require('express');
require('dotenv').config();
require('./connection/connection');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

const companyRoute = require('./routes/companyRoute');
const shareholderRoute = require('./routes/shareholderRoute');

app.use(express.json());
app.use(cors());
app.use('/api/company', companyRoute);
app.use('/api/shareholder', shareholderRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`\n App is ready! Go to http://localhost:5173\n`);
});