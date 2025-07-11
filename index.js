const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./models");
require('dotenv').config();
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
// db.sequelize.sync({ alter: true })  // Creates tables if not exist

app.get("/", (req, res) => res.send("Job Board API"));
app.use('/api/jobs', require('./routes/job.routes'));
app.use("/api/auth", require("./routes/auth.routes"));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/applications', require('./routes/application.routes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.listen(3000, () => console.log('Server running on port 3000'));
