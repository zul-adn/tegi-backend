require('dotenv').config()

const express = require('express')
const app = express()
const db = require('./models/bundle.model');
const bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
const path = require('path');
const cors = require('cors');

var options = {
    key: fs.readFileSync(path.join(__dirname, 'key', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'key', 'cert.pem'))
  };


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/upload', express.static('upload'))
app.use(cors({ origin: true }));

db.sequelize.sync({force: false});

const routes = require('./routes/routes');
routes(app)

const PORT = process.env.PORT

app.listen(PORT, ()=> {
  console.log("Running on serveer")
})

// var server = https.createServer(options, app).listen(PORT, function() {
//     console.log(`Runninggg ${PORT}`)
// })