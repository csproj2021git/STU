require('dotenv').config()
const cors = require('cors') 
const app = require('express')()
const handle = require('./handlers') 
const bodyParser = require('body-parser')
const routes = require('./routes')
const db = require('./models')

app.get('/', (req,res) => {
    res.send("Moodle server alive")
})

app.use(cors())
app.use(bodyParser.json())
app.use('/api/course',routes.course)
app.use(handle.notFound)
app.use(handle.errors)

app.listen(process.env.PORT, 
        console.log(`Server running on ${process.env.PORT}`))

process.env.SECRET = handle.getSecret()