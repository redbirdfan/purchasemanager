require('dotenv').config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "http://localhost:5000",
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());

const db =mysql.createConnection({ 
    host: "localhost",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
        if(err) {
                console.log("MySQL connection not made: ", err);
            return;
        }
        console.log("Connect to MySQL");
})

const port = 5000;
app.listen(port, () => {
    console.log("Listening on port 5000")
});


app.get("/", (req, res) => {
    console.log("Server route functioning")
})

