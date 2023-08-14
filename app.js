const express = require('express')
const app = express()
const port = 3000
const web = require('./routes/web')
const dotenv = require('dotenv')
const connectdb = require('./db/dbcon')
const cors = require('cors')
app.use(cors())
//cookies 
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const fileUpload = require("express-fileupload");
app.use(express.json())
app.use(fileUpload({useTempFiles:true}));


dotenv.config({path:".env"})
connectdb()





//routeload
app.use('/api', web)//localhost:3000/api/




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})