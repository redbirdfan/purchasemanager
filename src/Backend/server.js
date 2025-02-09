require('dotenv').config()

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("bcrypt");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const db =mysql.createConnection({ 
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((err) => {
        if(err) {
                console.log("MySQL connection not made: ", err);
            return;
        }
        console.log("Connected to MySQL");
})


app.listen(5000, () => {
    console.log("Listening on port 5000")
});


app.post("/loginPage", (req, res) => {
    const {username, password} = req.body;
    if(password && username){
        console.log("Password and username correct")
    } else {
        console.log("Password and Username are missing")
    }
    console.log("Server route functioning")
    res.json({ message: "Post request functioning"});

})

