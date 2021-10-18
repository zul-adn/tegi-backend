require('dotenv').config()

const express = require('express')
const app = express()
// const db = require('./models/bundle.model');
const bodyParser = require('body-parser')
const cors = require('cors')


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/upload', express.static('upload'))
app.use(cors({ origin: true }));

// db.sequelize.sync({force: false});

const routes = require('./routes/routes')
routes(app)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})