const express = require("express")
const dotenv = require('dotenv')
const mysql = require("mysql2");
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const morgan = require('morgan')
const autRoutes = require('./routes/routes')
const categoryRoutes = require('./routes/category')
const { readdirSync } = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;


// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,  // ใส่นี่
// });


//  middleware
app.use(morgan('tiny'))
app.use(express.json())




// Router

app.use('/api', autRoutes)
app.use('/api', categoryRoutes)




app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});